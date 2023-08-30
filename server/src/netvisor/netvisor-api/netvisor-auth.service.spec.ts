import { Test } from "@nestjs/testing";
import dayjs from "dayjs";
import { omit } from "lodash";
import mockConfigProvider from "../../../test/utils/mock-config.service";
import { NetvisorAuthService } from "./netvisor-auth.service";
import { NetvisorEndpoints } from "./netvisor-endpoints.enum";

describe("Netvisor authentication", () => {
  let netvisorAuthService: NetvisorAuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [NetvisorAuthService, mockConfigProvider()],
    }).compile();

    netvisorAuthService = module.get<NetvisorAuthService>(NetvisorAuthService);
  });

  it("Builds correct URL", () => {
    expect(netvisorAuthService.getUrl(NetvisorEndpoints.GET_WORKDAYS)).toEqual(
      "https://mock-netvisor.url.com/getworkdays.nv",
    );
  });

  describe("Builds correct headers", () => {
    const testUrl = "asd";
    let now: number;

    beforeAll(() => {
      now = Date.now();
      jest.useFakeTimers({ now });
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it("Static fields are correct", () => {
      const dynamicFields = [
        "X-Netvisor-Authentication-MAC",
        "X-Netvisor-Authentication-Timestamp",
        "X-Netvisor-Authentication-TransactionId",
      ];

      const expectedHeaders = {
        "X-Netvisor-Authentication-CustomerId": "test-customer-id",
        "X-Netvisor-Authentication-MACHashCalculationAlgorithm": "SHA256",
        "X-Netvisor-Authentication-PartnerId": "test-partner-id",
        "X-Netvisor-Authentication-Sender": "keijo",
        "X-Netvisor-Interface-Language": "fi",
        "X-Netvisor-Organisation-ID": "test-org-id",
      };

      const actualHeaders = omit(
        netvisorAuthService.getAuthenticationHeaders(testUrl),
        dynamicFields,
      );

      expect(actualHeaders).toEqual(expectedHeaders);
    });

    it("Timestamp is correct", () => {
      const expcetedTimestamp = dayjs(now).utc().format("YYYY-MM-DD HH:mm:ss.SSS");

      const actualTimestamp =
        netvisorAuthService.getAuthenticationHeaders(testUrl)[
          "X-Netvisor-Authentication-Timestamp"
        ];
      expect(actualTimestamp).toEqual(expcetedTimestamp);
    });
  });
});
