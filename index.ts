import type { PluginContext } from "@getpaseo/plugin";
import { SharedBrowserPanel, contributeSharedBrowserClient } from "./client/browser.client";
import {
  cleanupBrowserServer,
  handleApplyDevicePreset,
  handleAcquireControl,
  handleAttachBrowser,
  handleCaptureBrowser,
  handleDetachBrowser,
  handleListOpenBrowserWorkspaces,
  handleNavigateBrowser,
  handleReleaseControl,
  handleResizeBrowser,
  handleSendBrowserInput,
} from "./server/browser.server";
import {
  applyDevicePresetRpc,
  acquireControlRpc,
  attachBrowserRpc,
  captureBrowserRpc,
  detachBrowserRpc,
  listOpenBrowserWorkspacesRpc,
  navigateBrowserRpc,
  releaseControlRpc,
  resizeBrowserRpc,
  sendBrowserInputRpc,
} from "./shared/browser.shared";

export default function contribute(plugin: PluginContext) {
  plugin.handle(attachBrowserRpc, handleAttachBrowser);
  plugin.handle(detachBrowserRpc, handleDetachBrowser);
  plugin.handle(captureBrowserRpc, handleCaptureBrowser);
  plugin.handle(listOpenBrowserWorkspacesRpc, handleListOpenBrowserWorkspaces);
  plugin.handle(acquireControlRpc, handleAcquireControl);
  plugin.handle(releaseControlRpc, handleReleaseControl);
  plugin.handle(navigateBrowserRpc, handleNavigateBrowser);
  plugin.handle(resizeBrowserRpc, handleResizeBrowser);
  plugin.handle(applyDevicePresetRpc, handleApplyDevicePreset);
  plugin.handle(sendBrowserInputRpc, handleSendBrowserInput);

  plugin.addClientSide(contributeSharedBrowserClient);

  plugin.addWorkspacePanel({
    id: "shared-browser",
    title: "Shared Browser",
    icon: "PanelsTopLeft",
    context: "workspace",
    locations: ["workspace", "explorer"],
    Component: SharedBrowserPanel,
  });
  plugin.addCommandCenterItem({
    id: "open-shared-browser",
    title: "Open Shared Browser",
    icon: "PanelsTopLeft",
    keywords: ["browser", "shared", "remote"],
    context: "workspace",
    onSelect({ openPanel }) {
      openPanel("shared-browser");
    },
  });
  plugin.addCommandCenterItem({
    id: "open-shared-browser-agent",
    title: "Open Shared Browser",
    icon: "PanelsTopLeft",
    keywords: ["browser", "shared", "remote"],
    context: "agent",
    onSelect({ openPanel }) {
      openPanel("shared-browser");
    },
  });

  return async () => {
    if (typeof cleanupBrowserServer === "function") await cleanupBrowserServer();
  };
}
