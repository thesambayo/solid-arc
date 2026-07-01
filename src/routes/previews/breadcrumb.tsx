import { createFileRoute, Link } from "@tanstack/solid-router";
import { FolderIcon, SlashIcon } from "lucide-solid";

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

export const Route = createFileRoute("/previews/breadcrumb")({
  component: RouteComponent,
});

function Section(props: { title: string; description?: string; children: any }) {
  return (
    <div class="flex flex-col gap-3">
      <div>
        <p class="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {props.title}
        </p>
        {props.description && (
          <p class="mt-0.5 text-xs text-muted-foreground">
            {props.description}
          </p>
        )}
      </div>
      {props.children}
    </div>
  );
}

function RouteComponent() {
  return (
    <div class="flex max-w-2xl flex-col gap-8 p-8">
      <div>
        <h1 class="text-lg font-semibold">Breadcrumb</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Displays the path to the current resource.
        </p>
      </div>

      <Section title="Basic">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild={(p) => <a href="/" {...p()} />}>
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild={(p) => <a href="/components" {...p()} />}>
                Components
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Section>

      <Section
        title="Custom separator"
        description="Pass children to BreadcrumbSeparator to override the chevron."
      >
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild={(p) => <a href="/" {...p()} />}>
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <SlashIcon />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink asChild={(p) => <a href="/docs" {...p()} />}>
                Docs
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <SlashIcon />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Installation</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Section>

      <Section
        title="Dropdown"
        description="Compose a BreadcrumbItem with DropdownMenu for in-place navigation."
      >
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild={(p) => <a href="/" {...p()} />}>
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <DropdownMenu positioning={{ placement: "bottom-start" }}>
                <DropdownMenuTrigger class="flex items-center gap-1 hover:text-foreground">
                  Components
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem value="combobox">Combobox</DropdownMenuItem>
                  <DropdownMenuItem value="command">Command</DropdownMenuItem>
                  <DropdownMenuItem value="dropdown-menu">
                    Dropdown Menu
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Section>

      <Section
        title="Collapsed"
        description="Use BreadcrumbEllipsis for long paths; often paired with a dropdown."
      >
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild={(p) => <a href="/" {...p()} />}>
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <DropdownMenu positioning={{ placement: "bottom-start" }}>
                <DropdownMenuTrigger>
                  <BreadcrumbEllipsis />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem value="documentation">
                    <FolderIcon /> Documentation
                  </DropdownMenuItem>
                  <DropdownMenuItem value="components">
                    <FolderIcon /> Components
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild={(p) => <a href="/components" {...p()} />}>
                Components
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Section>

      <Section
        title="Router link"
        description="Use asChild to render the TanStack Router Link directly."
      >
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild={(p) => <Link to="/previews" {...p()} />}>
                Components
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                asChild={(p) => <Link to="/previews/breadcrumb" {...p()} />}
              >
                Breadcrumb
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Section>
    </div>
  );
}
