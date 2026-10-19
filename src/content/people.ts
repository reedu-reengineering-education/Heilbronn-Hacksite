/**
 * Placeholder mentor roster. Swap in real names, photos and interests once
 * they're confirmed — `avatar` is optional and falls back to an initials
 * avatar when omitted.
 */

/** Omitted for regular on-site mentors. */
export type MentorTeam = "awareness" | "remote";

export type Mentor = {
  name: string;
  interest: string;
  avatar?: string;
  /** Shown on the back of the card when it is flipped. */
  altAvatar?: string;
  team?: MentorTeam;
};

export const mentors: Mentor[] = [
  { name: "Umut Tas", interest: "Impact", avatar: "/mentors/org/umut.jpg", altAvatar: "/mentors/alt/umut.jpg" },
  { name: "Jan Wirwahn", interest: "Hardware", avatar: "/mentors/org/jan.jpg", altAvatar: "/mentors/alt/jan.jpg" },
  { name: "Eric Thieme-Garmann", interest: "Software", avatar: "/mentors/org/eric.jpg", altAvatar: "/mentors/alt/eric.png" },
  { name: "Felix Erdmann", interest: "Data", avatar: "/mentors/org/felix.jpg", altAvatar: "/mentors/alt/felix.png" },
  { name: "Dr. Steffen Ciprina", interest: "Education", avatar: "/mentors/org/steffen.jpg", altAvatar: "/mentors/alt/steffen.jpeg", team: "awareness" },
  { name: "Eva Jacobs", interest: "Education", avatar: "/mentors/org/eva.png", altAvatar: "/mentors/alt/eva.png", team: "awareness" },
  { name: "Paula Scharf", interest: "AI", avatar: "/mentors/org/paula.png", altAvatar: "/mentors/alt/paula.jpg", team: "remote" },
];

export type OrgaMember = {
  name: string;
  organization: string;
  avatar?: string;
};

/** Placeholders until the orga team is confirmed. */
export const orgaTeam: OrgaMember[] = [
  { name: "TBA", organization: "aim", avatar: "/orga/placeholder.svg" },
  { name: "TBA", organization: "aim", avatar: "/orga/placeholder.svg" },
  { name: "TBA", organization: "Arkadia", avatar: "/orga/placeholder.svg" },
  { name: "TBA", organization: "Arkadia", avatar: "/orga/placeholder.svg" },
];
