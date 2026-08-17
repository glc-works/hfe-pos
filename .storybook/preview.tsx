import React from "react";
import type { Preview } from "@storybook/react";
import { MerchantConfigProvider } from "../src/context/MerchantConfigContext";
import { LanguageProvider } from "../src/context/LanguageContext";
import { ViewportProvider } from "../src/context/ViewportContext";
import { NotificationProvider } from "../src/context/NotificationContext";
import "../src/index.css";

const preview: Preview = {
  decorators: [
    (Story) => (
      <MerchantConfigProvider>
        <LanguageProvider>
          <ViewportProvider>
            <NotificationProvider>
              <div className="bg-slate-950 text-slate-100 font-sans min-h-screen p-4 flex items-center justify-center">
                <Story />
              </div>
            </NotificationProvider>
          </ViewportProvider>
        </LanguageProvider>
      </MerchantConfigProvider>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#020617' },
        { name: 'light', value: '#ffffff' },
      ],
    },
  },
};

export default preview;
