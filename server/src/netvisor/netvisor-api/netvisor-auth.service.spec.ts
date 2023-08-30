import { Test } from "@nestjs/testing";
import dayjs from "dayjs";
import { omit } from "lodash";
import mockConfigProvider from "../../../test/utils/mock-config.service";
import { ConfigService } from "../../config/config.service";
import { NetvisorAuthService } from "./netvisor-auth.service";
import { NetvisorEndpoints } from "./netvisor-endpoints.enum";

describe("Netvisor authentication", () => {
  let netvisorAuthService: NetvisorAuthService;
  let testUrl: string;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [NetvisorAuthService, mockConfigProvider()],
    }).compile();

    netvisorAuthService = module.get(NetvisorAuthService);
    testUrl = module.get<ConfigService>(ConfigService).config.netvisor.host;
  });

  it("Builds correct URL", () => {
    expect(netvisorAuthService.getUrl(NetvisorEndpoints.GET_WORKDAYS)).toEqual(
      "https://mock-netvisor.url.com/getworkdays.nv",
    );
  });

  describe("Builds correct headers", () => {
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
      const expectedTimestamp = dayjs(now).utc().format("YYYY-MM-DD HH:mm:ss.SSS");

      const actualTimestamp =
        netvisorAuthService.getAuthenticationHeaders(testUrl)[
          "X-Netvisor-Authentication-Timestamp"
        ];

      expect(actualTimestamp).toEqual(expectedTimestamp);
    });

    it("Transaction ID is correct", () => {
      const uuidMatcher = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      const firstId =
        netvisorAuthService.getAuthenticationHeaders(testUrl)[
          "X-Netvisor-Authentication-TransactionId"
        ];
      const secondId =
        netvisorAuthService.getAuthenticationHeaders(testUrl)[
          "X-Netvisor-Authentication-TransactionId"
        ];

      expect(firstId).not.toEqual(secondId);
      expect(firstId).toMatch(uuidMatcher);
      expect(secondId).toMatch(uuidMatcher);
    });

    it("MAC hash is correct", () => {
      // Check just that the resulting string appears to be a valid SHA256 hash.
      // Otherwise, we'd need to modify `getAuthenticationHeaders` to accept UUID override and the
      // resulting test code would be just a copy-paste.
      const shaMatcher = /^[0-9a-f]{64}$/i;
      const actualHash =
        netvisorAuthService.getAuthenticationHeaders(testUrl)["X-Netvisor-Authentication-MAC"];
      expect(actualHash).toMatch(shaMatcher);
    });
  });
});
