/**
 * Placeholder mentor roster. Swap in real names, photos and interests once
 * they're confirmed — `avatar` is optional and falls back to an initials
 * avatar when omitted.
 */

export type Mentor = {
  name: string;
  interest: string;
  avatar?: string;
  /** Shown on the back of the card when it is flipped. */
  altAvatar?: string;
};

export const mentors: Mentor[] = [
  { name: "Umut Tas", interest: "Impact", avatar: "/mentors/org/umut.jpg", altAvatar: "/mentors/alt/umut.jpg" },
  { name: "Jan Wirwahn", interest: "Hardware", avatar: "/mentors/org/jan.jpg", altAvatar: "/mentors/alt/jan.jpg" },
  { name: "Eric Thieme-Garmann", interest: "Software", avatar: "/mentors/org/eric.jpg", altAvatar: "/mentors/alt/eric.jpg" },
  { name: "Felix Erdmann", interest: "Data", avatar: "/mentors/org/felix.jpg", altAvatar: "/mentors/alt/felix.jpg" },
  { name: "Dr. Steffen Ciprina", interest: "Education", avatar: "/mentors/org/steffen.jpg", altAvatar: "/mentors/alt/steffen.jpg" },
  { name: "Eva Jacobs", interest: "Education", avatar: "/mentors/org/eva.png", altAvatar: "/mentors/alt/eva.png" },
];
