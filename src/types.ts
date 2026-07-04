/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum SkillType {
  TECHNICAL_RIGOR = "TECHNICAL_RIGOR",
  COMMUNICATION = "COMMUNICATION",
  ADAPTABILITY = "ADAPTABILITY",
  RELIABILITY = "RELIABILITY"
}

export interface SkillMatrix {
  [SkillType.TECHNICAL_RIGOR]: number; // 0 - 100
  [SkillType.COMMUNICATION]: number;   // 0 - 100
  [SkillType.ADAPTABILITY]: number;    // 0 - 100
  [SkillType.RELIABILITY]: number;     // 0 - 100
}

export interface Actor {
  id: string;
  name: string;
  role: "TECH_LEAD" | "PRODUCT_OWNER" | "PEER_DEVELOPER" | "RECRUITER";
  avatar: string;
  personality: {
    strictness: number;  // 1-5
    empathy: number;     // 1-5
    communicationStyle: "direct" | "mentorship" | "passive-aggressive";
  };
}

export interface Company {
  id: string;
  name: string;
  industry: "Fintech" | "Healthcare" | "E-commerce";
  culture: string;
  stack: string[];
  techLead: Actor;
  productOwner: Actor;
  peerDeveloper: Actor;
  description: string;
}

export interface Email {
  id: string;
  sender: string;
  senderRole: string;
  subject: string;
  body: string;
  timestamp: string;
  read: boolean;
  hasAttachment?: boolean;
}

export interface SlackChannel {
  id: string;
  name: string;
  unread: boolean;
}

export interface SlackMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  status: "BACKLOG" | "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
  points: number;
}

export interface PullRequest {
  id: string;
  ticketId: string;
  title: string;
  branchName: string;
  codeChanges: {
    file: string;
    additions: string[];
    deletions: string[];
  }[];
  comments: {
    actorId: string;
    actorName: string;
    avatar: string;
    content: string;
    timestamp: string;
  }[];
  status: "OPEN" | "CHANGES_REQUESTED" | "APPROVED" | "MERGED";
}

export interface SimulationState {
  step: "AUTH" | "INTERVIEW" | "ANALYSIS" | "OFFER" | "WORKSPACE";
  user: {
    name: string;
    email: string;
    avatar: string;
    provider: "google" | "github" | null;
  };
  skills: SkillMatrix;
  company: Company | null;
  emails: Email[];
  slackChannels: SlackChannel[];
  slackMessages: { [channelId: string]: SlackMessage[] };
  activeChannelId: string;
  tickets: Ticket[];
  pullRequest: PullRequest | null;
  history: {
    timestamp: string;
    description: string;
    impact: string;
  }[];
}
