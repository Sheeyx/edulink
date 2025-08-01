"use client";

import { useEffect } from "react";
import Script from "next/script";

export default function TelegramLoginButton() {
  useEffect(() => {
    // @ts-ignore
    window.TelegramLoginWidget = {
      dataOnauth: (user: any) => {
        fetch("/api/auth/telegram-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        }).then(() => {
          window.location.href = "/student";
        });
      },
    };
  }, []);

  return (
    <>
      <Script src="https://telegram.org/js/telegram-widget.js?7" strategy="beforeInteractive" />
      <div
        className="my-4"
        dangerouslySetInnerHTML={{
          __html: `
            <script async src="https://telegram.org/js/telegram-widget.js?7"
              data-telegram-login="eduliink_bot"
              data-size="large"
              data-userpic="false"
              data-request-access="write"
              data-onauth="TelegramLoginWidget.dataOnauth(user)">
            </script>
          `,
        }}
      />
    </>
  );
}
