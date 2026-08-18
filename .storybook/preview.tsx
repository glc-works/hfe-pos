import React from "react";
import type { Preview } from "@storybook/react";
import { ThemeProvider } from "../src/context/ThemeContext";
import { MerchantConfigProvider } from "../src/context/MerchantConfigContext";
import { LanguageProvider } from "../src/context/LanguageContext";
import { ViewportProvider } from "../src/context/ViewportContext";
import { NotificationProvider } from "../src/context/NotificationContext";
import "../src/index.css";

const customViewports = {
  iphone14: {
    name: "iPhone 14",
    styles: {
      width: "390px",
      height: "844px",
    },
  },
  iphonese: {
    name: "iPhone SE",
    styles: {
      width: "375px",
      height: "667px",
    },
  },
  tablet: {
    name: "iPad / Tablet",
    styles: {
      width: "768px",
      height: "1024px",
    },
  },
  desktop: {
    name: "Desktop HD",
    styles: {
      width: "1280px",
      height: "800px",
    },
  },
};

const preview: Preview = {
  decorators: [
    (Story, context) => {
      const isFullscreen = context.parameters.layout === "fullscreen";
      return (
        <ThemeProvider>
          <LanguageProvider>
            <ViewportProvider>
              <NotificationProvider>
                <MerchantConfigProvider>
                  {isFullscreen ? (
                    <div className="bg-canvas text-primary font-sans min-h-screen w-full">
                      <Story />
                    </div>
                  ) : (
                    <div className="bg-canvas text-primary font-sans min-h-screen p-4 flex items-center justify-center">
                      <Story />
                    </div>
                  )}
                </MerchantConfigProvider>
              </NotificationProvider>
            </ViewportProvider>
          </LanguageProvider>
        </ThemeProvider>
      );
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "dark",
      values: [
        { name: "dark", value: "#020617" },
        { name: "light", value: "#ffffff" },
      ],
    },
    viewport: {
      viewports: customViewports,
    },
  },
};

export default preview;

