import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import {
  GrowthBook,
  GrowthBookProvider,
  useFeature,
} from "@growthbook/growthbook-react";
import { useEffect } from "react";
import { trpc } from "@/utils/trpc";
import "@/styles/globals.css";

const FEATURES_ENDPOINT = "https://cdn.growthbook.io/api/features/prod_qvbdG816DboYGtrbod75milcSpqF38CwKpp4xUxs";

const growthbook = new GrowthBook({
  // enableDevMode: true allows you to use the Chrome DevTools Extension to test/debug.
  enableDevMode: true,
  trackingCallback: (experiment, result) => {
    console.log({
      experimentId: experiment.key,
      variationId: result.variationId,
    });
  },
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  router,
  pageProps: { session, ...pageProps },
}) => {
  useEffect(() => {
    fetch(FEATURES_ENDPOINT)
      .then((res) => res.json())
      .then((json) => {
        growthbook.setFeatures(json.features);
      });

    growthbook.setAttributes({
      id: "123",
      loggedIn: true,
      deviceId: "abcdef123456",
      employee: true,
      company: "acme",
      country: "US",
      browser: navigator.userAgent,
      url: router.pathname,
    });
  }, [router.pathname]);

  return (
    <GrowthBookProvider growthbook={growthbook}>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </GrowthBookProvider>
  );
};

export default trpc.withTRPC(MyApp);
