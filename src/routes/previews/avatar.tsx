import { createFileRoute } from "@tanstack/solid-router";
import { UsersIcon } from "lucide-solid";

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "../../components/ui/avatar";

export const Route = createFileRoute("/previews/avatar")({
  component: RouteComponent,
});

function Section(props: { title: string; children: any }) {
  return (
    <div class="flex flex-col gap-3">
      <p class="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {props.title}
      </p>
      <div class="flex flex-wrap items-center gap-3">{props.children}</div>
    </div>
  );
}

const AVATARS = [
  {
    src: "https://i.pravatar.cc/300?u=sarah",
    name: "Sarah Chen",
    initials: "SC",
  },
  {
    src: "https://i.pravatar.cc/300?u=alex",
    name: "Alex Rivera",
    initials: "AR",
  },
  {
    src: "https://i.pravatar.cc/300?u=jordan",
    name: "Jordan Lee",
    initials: "JL",
  },
  {
    src: "https://i.pravatar.cc/300?u=morgan",
    name: "Morgan Kim",
    initials: "MK",
  },
];

function RouteComponent() {
  return (
    <div class="flex max-w-2xl flex-col gap-8 p-8">
      <div>
        <h1 class="text-lg font-semibold">Avatar</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          User avatar with fallback. Built on Ark UI.
        </p>
      </div>

      <Section title="Basic">
        <Avatar>
          <AvatarImage
            src="https://i.pravatar.cc/300?u=sarah"
            alt="Sarah Chen"
          />
          <AvatarFallback>SC</AvatarFallback>
        </Avatar>
        {/* Broken src — shows fallback */}
        <Avatar>
          <AvatarImage src="/broken.jpg" alt="Broken" />
          <AvatarFallback>AR</AvatarFallback>
        </Avatar>
        {/* No image — shows fallback immediately */}
        <Avatar>
          <AvatarFallback>JL</AvatarFallback>
        </Avatar>
      </Section>

      <Section title="Sizes">
        <Avatar size="sm">
          <AvatarImage
            src="https://i.pravatar.cc/300?u=sarah"
            alt="Sarah Chen"
          />
          <AvatarFallback>SC</AvatarFallback>
        </Avatar>
        <Avatar size="default">
          <AvatarImage
            src="https://i.pravatar.cc/300?u=sarah"
            alt="Sarah Chen"
          />
          <AvatarFallback>SC</AvatarFallback>
        </Avatar>
        <Avatar size="lg">
          <AvatarImage
            src="https://i.pravatar.cc/300?u=sarah"
            alt="Sarah Chen"
          />
          <AvatarFallback>SC</AvatarFallback>
        </Avatar>
      </Section>

      <Section title="Fallback sizes">
        <Avatar size="sm">
          <AvatarFallback>SC</AvatarFallback>
        </Avatar>
        <Avatar size="default">
          <AvatarFallback>SC</AvatarFallback>
        </Avatar>
        <Avatar size="lg">
          <AvatarFallback>SC</AvatarFallback>
        </Avatar>
      </Section>

      <Section title="With badge (presence)">
        <Avatar>
          <AvatarImage src="https://i.pravatar.cc/300?u=sarah" alt="Online" />
          <AvatarFallback>SC</AvatarFallback>
          <AvatarBadge />
        </Avatar>
        <Avatar>
          <AvatarImage src="https://i.pravatar.cc/300?u=alex" alt="Away" />
          <AvatarFallback>AR</AvatarFallback>
          <AvatarBadge class="bg-warning" />
        </Avatar>
        <Avatar>
          <AvatarImage src="https://i.pravatar.cc/300?u=jordan" alt="Busy" />
          <AvatarFallback>JL</AvatarFallback>
          <AvatarBadge class="bg-destructive" />
        </Avatar>
        <Avatar>
          <AvatarFallback>MK</AvatarFallback>
          <AvatarBadge class="bg-muted-foreground" />
        </Avatar>
      </Section>

      <Section title="Badge — all sizes">
        <Avatar size="sm">
          <AvatarImage src="https://i.pravatar.cc/300?u=sarah" alt="Sarah" />
          <AvatarFallback>SC</AvatarFallback>
          <AvatarBadge />
        </Avatar>
        <Avatar size="default">
          <AvatarImage src="https://i.pravatar.cc/300?u=sarah" alt="Sarah" />
          <AvatarFallback>SC</AvatarFallback>
          <AvatarBadge />
        </Avatar>
        <Avatar size="lg">
          <AvatarImage src="https://i.pravatar.cc/300?u=sarah" alt="Sarah" />
          <AvatarFallback>SC</AvatarFallback>
          <AvatarBadge />
        </Avatar>
      </Section>

      <Section title="Group">
        <AvatarGroup>
          {AVATARS.slice(0, 3).map((a) => (
            <Avatar>
              <AvatarImage src={a.src} alt={a.name} />
              <AvatarFallback>{a.initials}</AvatarFallback>
            </Avatar>
          ))}
        </AvatarGroup>

        <AvatarGroup>
          {AVATARS.slice(0, 3).map((a) => (
            <Avatar size="sm">
              <AvatarImage src={a.src} alt={a.name} />
              <AvatarFallback>{a.initials}</AvatarFallback>
            </Avatar>
          ))}
        </AvatarGroup>

        <AvatarGroup>
          {AVATARS.slice(0, 3).map((a) => (
            <Avatar size="lg">
              <AvatarImage src={a.src} alt={a.name} />
              <AvatarFallback>{a.initials}</AvatarFallback>
            </Avatar>
          ))}
        </AvatarGroup>
      </Section>

      <Section title="Group with count">
        <AvatarGroup>
          {AVATARS.slice(0, 3).map((a) => (
            <Avatar>
              <AvatarImage src={a.src} alt={a.name} />
              <AvatarFallback>{a.initials}</AvatarFallback>
            </Avatar>
          ))}
          <AvatarGroupCount>+9</AvatarGroupCount>
        </AvatarGroup>

        <AvatarGroup>
          {AVATARS.slice(0, 3).map((a) => (
            <Avatar size="sm">
              <AvatarImage src={a.src} alt={a.name} />
              <AvatarFallback>{a.initials}</AvatarFallback>
            </Avatar>
          ))}
          <AvatarGroupCount>+9</AvatarGroupCount>
        </AvatarGroup>

        <AvatarGroup>
          {AVATARS.slice(0, 3).map((a) => (
            <Avatar size="lg">
              <AvatarImage src={a.src} alt={a.name} />
              <AvatarFallback>{a.initials}</AvatarFallback>
            </Avatar>
          ))}
          <AvatarGroupCount>
            <UsersIcon />
          </AvatarGroupCount>
        </AvatarGroup>
      </Section>
    </div>
  );
}
