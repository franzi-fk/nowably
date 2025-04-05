import { defineStore } from "pinia";

export const useAppStore = defineStore("appStore", {
  state: () => ({
    userMenuNav: [
      { name: "Home", link: "/", icon: "home" },
      { name: "All tasks", link: "/all-tasks", icon: "layoutList" },
      {
        name: "Completion Cards",
        link: "/completion-cards",
        icon: "galleryHorizontalEnd",
      },
      {
        name: "Send Message in a Bottle",
        link: "/send-message-in-bottle",
        icon: "sendHorizontal",
      },
      {
        name: "Received Messages in a Bottle",
        link: "/received-messages",
        icon: "messageCircleHeart",
      },
    ],
    adminMenuNav: [
      { name: "Home", link: "/", icon: "home" },
      { name: "All tasks", link: "/all-tasks", icon: "layoutList" },
      {
        name: "Completion Cards",
        link: "/completion-cards",
        icon: "galleryHorizontalEnd",
      },
      {
        name: "Send Message in a Bottle",
        link: "/send-message-in-bottle",
        icon: "sendHorizontal",
      },
      {
        name: "Received Messages in a Bottle",
        link: "/received-messages",
        icon: "messageCircleHeart",
      },
      {
        name: "Moderate Mebos",
        link: "/moderate-mebos",
        icon: "messageSquareQuote",
      },
    ],
  }),
});
