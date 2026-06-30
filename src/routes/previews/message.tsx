import { createFileRoute } from "@tanstack/solid-router";
import {
  CopyIcon,
  FileTextIcon,
  RefreshCwIcon,
  ThumbsUpIcon,
  XIcon,
} from "lucide-solid";

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "../../components/ui/attachment";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Bubble, BubbleContent } from "../../components/ui/bubble";
import { Button } from "../../components/ui/button";
import {
  Marker,
  MarkerContent,
  MarkerIcon,
} from "../../components/ui/marker";
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
} from "../../components/ui/message";
import { Spinner } from "../../components/ui/spinner";

export const Route = createFileRoute("/previews/message")({
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

function Ava(props: { children: string }) {
  return (
    <Avatar class="size-8">
      <AvatarFallback>{props.children}</AvatarFallback>
    </Avatar>
  );
}

// Deterministic offline placeholder thumbnail.
const thumb = (hue: number) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><rect width='80' height='80' fill='hsl(${hue} 70% 60%)'/><circle cx='24' cy='28' r='10' fill='hsl(${hue} 80% 85%)'/><path d='M0 80 L30 44 L52 66 L66 52 L80 66 L80 80 Z' fill='hsl(${hue} 60% 40%)'/></svg>`,
  )}`;

function RouteComponent() {
  return (
    <div class="flex max-w-xl flex-col gap-8 p-8">
      <div>
        <h1 class="text-lg font-semibold">Message</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Row layout for a conversation message — avatar, alignment, header, and
          footer around a <code class="text-foreground">Bubble</code>.
        </p>
      </div>

      <Section
        title="Avatar & alignment"
        description="align=start for them, align=end for you."
      >
        <div class="flex flex-col gap-4 rounded-xl border border-border p-4">
          <Message align="start">
            <MessageAvatar>
              <Ava>AI</Ava>
            </MessageAvatar>
            <MessageContent>
              <Bubble variant="secondary">
                <BubbleContent>How can I help you today?</BubbleContent>
              </Bubble>
            </MessageContent>
          </Message>

          <Message align="end">
            <MessageAvatar>
              <Ava>SA</Ava>
            </MessageAvatar>
            <MessageContent>
              <Bubble variant="default">
                <BubbleContent>Port the Message component, please.</BubbleContent>
              </Bubble>
            </MessageContent>
          </Message>
        </div>
      </Section>

      <Section
        title="Group"
        description="Stack consecutive messages; only the last keeps a visible avatar."
      >
        <MessageGroup>
          <Message align="start">
            <MessageAvatar />
            <MessageContent>
              <Bubble variant="secondary">
                <BubbleContent>On it — three parts plus the group.</BubbleContent>
              </Bubble>
            </MessageContent>
          </Message>
          <Message align="start">
            <MessageAvatar />
            <MessageContent>
              <Bubble variant="secondary">
                <BubbleContent>Avatar anchors to the last row.</BubbleContent>
              </Bubble>
            </MessageContent>
          </Message>
          <Message align="start">
            <MessageAvatar>
              <Ava>AI</Ava>
            </MessageAvatar>
            <MessageContent>
              <Bubble variant="secondary">
                <BubbleContent>Like this.</BubbleContent>
              </Bubble>
            </MessageContent>
          </Message>
        </MessageGroup>
      </Section>

      <Section
        title="Header & footer"
        description="Sender name above, delivery status below."
      >
        <Message align="start">
          <MessageAvatar>
            <Ava>AI</Ava>
          </MessageAvatar>
          <MessageContent>
            <MessageHeader>Assistant</MessageHeader>
            <Bubble variant="secondary">
              <BubbleContent>Done. Want me to wire the preview?</BubbleContent>
            </Bubble>
            <MessageFooter>Read 2:14 PM</MessageFooter>
          </MessageContent>
        </Message>
      </Section>

      <Section
        title="Actions"
        description="Icon-only action buttons in the footer (each aria-labelled)."
      >
        <Message align="start">
          <MessageAvatar>
            <Ava>AI</Ava>
          </MessageAvatar>
          <MessageContent>
            <Bubble variant="secondary">
              <BubbleContent>
                The registry build emitted 34 entries, all green.
              </BubbleContent>
            </Bubble>
            <MessageFooter class="gap-0.5">
              <Button variant="ghost" size="icon-xs" aria-label="Copy">
                <CopyIcon />
              </Button>
              <Button variant="ghost" size="icon-xs" aria-label="Retry">
                <RefreshCwIcon />
              </Button>
              <Button variant="ghost" size="icon-xs" aria-label="Good response">
                <ThumbsUpIcon />
              </Button>
            </MessageFooter>
          </MessageContent>
        </Message>
      </Section>

      <Section
        title="Attachment"
        description="A ghost bubble unframes the surface so attachments sit raw, with a caption bubble below."
      >
        <Message align="end">
          <MessageAvatar>
            <Ava>SA</Ava>
          </MessageAvatar>
          <MessageContent>
            <Bubble variant="ghost">
              <BubbleContent>
                <Attachment orientation="vertical">
                  <AttachmentMedia variant="image">
                    <img src={thumb(210)} alt="" />
                  </AttachmentMedia>
                  <AttachmentContent>
                    <AttachmentTitle>design-spec.png</AttachmentTitle>
                    <AttachmentDescription>PNG · 840 KB</AttachmentDescription>
                  </AttachmentContent>
                </Attachment>
              </BubbleContent>
            </Bubble>
            <Bubble variant="default">
              <BubbleContent>Here's the spec — can you review?</BubbleContent>
            </Bubble>
          </MessageContent>
        </Message>

        <Message align="start" class="mt-4">
          <MessageAvatar>
            <Ava>AI</Ava>
          </MessageAvatar>
          <MessageContent>
            <Bubble variant="secondary">
              <BubbleContent>Got it — opening the file now.</BubbleContent>
            </Bubble>
            <MessageFooter>
              <Attachment class="min-w-0">
                <AttachmentMedia>
                  <FileTextIcon />
                </AttachmentMedia>
                <AttachmentContent>
                  <AttachmentTitle>review-notes.pdf</AttachmentTitle>
                  <AttachmentDescription>PDF · 1.1 MB</AttachmentDescription>
                </AttachmentContent>
                <AttachmentActions>
                  <AttachmentAction aria-label="Remove review-notes.pdf">
                    <XIcon />
                  </AttachmentAction>
                </AttachmentActions>
              </Attachment>
            </MessageFooter>
          </MessageContent>
        </Message>
      </Section>

      <Section
        title="Status (ghost surface)"
        description="In-progress message: a Marker with role=status, no bubble frame."
      >
        <Message align="start">
          <MessageAvatar>
            <Ava>AI</Ava>
          </MessageAvatar>
          <MessageContent>
            <Bubble variant="ghost">
              <BubbleContent>
                <Marker role="status">
                  <MarkerIcon>
                    <Spinner />
                  </MarkerIcon>
                  <MarkerContent>Checking the logs…</MarkerContent>
                </Marker>
              </BubbleContent>
            </Bubble>
          </MessageContent>
        </Message>
      </Section>
    </div>
  );
}
