import axios from "axios";

/**
 * This module attempts to refresh the user's Shibboleth session after it expires. This
 * should prevent situations where the SPA lies idle until the session expires and the
 * user then tries to initiate a GraphQL operation that will subsequently fail due to
 * missing Shibboleth session.
 *
 * In practice, we poll the session status endpoint provided by Shibboleth and also
 * check it whenever the window gets focus (as JS timers may be paused or slowed down
 * by the browser). If the session has expired, we reload the window which will either
 * create a new session or prompt the user to authenticate.
 */

// Interval for polling the session status endpoint in minutes.
const pollIntervalMinutes = 5;
const pollIntervalMs = pollIntervalMinutes * 60 * 1000;
const sessionStatusUrl = "/Shibboleth.sso/Session";

const checkSessionStatus = async () => {
  const { data } = await axios.get(sessionStatusUrl);

  // Empty response object means user has no valid session.
  if (Object.keys(data).length === 0) {
    location.reload();
  }
};

if (process.env.NODE_ENV === "production") {
  setInterval(checkSessionStatus, pollIntervalMs);
  window.addEventListener("focus", checkSessionStatus);
}
