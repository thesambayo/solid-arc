import { createFileRoute } from "@tanstack/solid-router";
import {
  CreditCardIcon,
  LogOutIcon,
  PanelsTopLeftIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-solid";
import { createSignal } from "solid-js";

import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

export const Route = createFileRoute("/previews/dropdown-menu")({
  component: RouteComponent,
});

function Section(props: { title: string; children: any }) {
  return (
    <div class="flex flex-col gap-3">
      <p class="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {props.title}
      </p>
      <div class="flex flex-wrap gap-3">{props.children}</div>
    </div>
  );
}

function RouteComponent() {
  const [showStatusBar, setShowStatusBar] = createSignal(true);
  const [showSidebar, setShowSidebar] = createSignal(false);
  const [theme, setTheme] = createSignal("light");

  return (
    <div class="flex max-w-2xl flex-col gap-8 p-8">
      <div>
        <h1 class="text-lg font-semibold">Dropdown Menu</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Dropdown menu built on Ark UI.
        </p>
      </div>

      <Section title="Basic">
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild={(p) => (
              <Button variant="outline" {...p()}>
                Open menu
              </Button>
            )}
          />
          <DropdownMenuContent>
            <DropdownMenuItem value="profile">
              <UserIcon />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem value="billing">
              <CreditCardIcon />
              Billing
            </DropdownMenuItem>
            <DropdownMenuItem value="settings">
              <SettingsIcon />
              Settings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Section>

      <Section title="With groups, labels and shortcuts">
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild={(p) => (
              <Button variant="outline" {...p()}>
                My account
              </Button>
            )}
          />
          <DropdownMenuContent class="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator class="bg-border/15" />
            <DropdownMenuGroup>
              <DropdownMenuItem value="profile">
                <UserIcon />
                Profile
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem value="billing">
                <CreditCardIcon />
                Billing
                <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem value="settings">
                <SettingsIcon />
                Settings
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem value="logout" variant="destructive">
              <LogOutIcon />
              Log out
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Section>

      <Section title="With checkbox items (with placement)">
        <DropdownMenu positioning={{ placement: "right-start" }}>
          <DropdownMenuTrigger
            asChild={(p) => (
              <Button variant="outline" {...p()}>
                View
              </Button>
            )}
          />
          <DropdownMenuContent class="w-48">
            <DropdownMenuLabel>Appearance</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              value="status-bar"
              checked={showStatusBar()}
              onCheckedChange={setShowStatusBar}
            >
              Status Bar
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              value="sidebar"
              checked={showSidebar()}
              onCheckedChange={setShowSidebar}
            >
              Sidebar
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Section>

      <Section title="With radio items">
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild={(p) => (
              <Button variant="outline" {...p()}>
                Theme: {theme()}
              </Button>
            )}
          />
          <DropdownMenuContent class="w-40">
            <DropdownMenuLabel>Theme</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={theme()}
              onValueChange={(d) => setTheme(d.value)}
            >
              <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="system">
                System
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </Section>

      <Section title="With submenu">
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild={(p) => (
              <Button variant="outline" {...p()}>
                Open menu
              </Button>
            )}
          />
          <DropdownMenuContent class="w-48">
            <DropdownMenuItem value="profile">
              <UserIcon />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <PanelsTopLeftIcon />
                Layout
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem value="sidebar">Sidebar</DropdownMenuItem>
                <DropdownMenuItem value="full-width">
                  Full width
                </DropdownMenuItem>
                <DropdownMenuItem value="compact">Compact</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem value="logout" variant="destructive">
              <LogOutIcon />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Section>

      <Section title="With inset items">
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild={(p) => (
              <Button variant="outline" {...p()}>
                Open menu
              </Button>
            )}
          />
          <DropdownMenuContent class="w-48">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem value="with-icon">
              <UserIcon />
              With icon
            </DropdownMenuItem>
            <DropdownMenuItem value="without-icon">
              Without icon
            </DropdownMenuItem>
            <DropdownMenuItem value="also-without-icon">
              Also without icon
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Section>
    </div>
  );
}
