import type { IconName } from "./nav";

export type FeedTag = "comida" | "siesta" | "actividad" | "logro" | "animo" | "foto" | "anuncio";

// Los posts de niño llevan initial; el anuncio lleva icon y sin initial.
export type FeedAuthor = {
  name: string;
  initial?: string;
  icon?: IconName;
};

export type FeedPost = {
  id: string;
  tag: FeedTag;
  author: FeedAuthor;
  time: string;
  authorNote: string;
  audience: string;
  body: string;
  photoLabel?: string;
  likes: number;
  comments: number;
};

export const feedPosts: FeedPost[] = [
  {
    id: "post-1",
    tag: "logro",
    author: { name: "Mateo", initial: "M" },
    time: "14:20",
    authorNote: "publicado por vos",
    audience: "Para: familia de Mateo",
    body: "¡Usó el orinal solito por primera vez! Estaba feliz de contárselo a todos. Un gran paso.",
    likes: 3,
    comments: 1,
  },
  {
    id: "post-2",
    tag: "actividad",
    author: { name: "Mateo", initial: "M" },
    time: "09:40",
    authorNote: "publicado por vos",
    audience: "Para: familia de Mateo",
    body: "Pintamos con témperas esta mañana. Mateo eligió el azul para todo y se concentró un montón mezclando colores.",
    photoLabel: "Foto · pintando con témperas",
    likes: 5,
    comments: 2,
  },
  {
    id: "post-3",
    tag: "anuncio",
    author: { name: "Anuncio general", icon: "megaphone" },
    time: "07:50",
    authorNote: "publicado por vos",
    audience: "Para: toda la sala",
    body: "El viernes salimos al parque por la mañana. Recuerden mandar gorra y una botellita de agua.",
    likes: 8,
    comments: 0,
  },
];

// Store en memoria del proceso: sobrevive a las requests, no a reinicios.
const createdPosts: FeedPost[] = [];

export type NewPostInput = {
  tag: FeedTag;
  audience: string;
  body: string;
};

export function addPost(input: NewPostInput): FeedPost {
  const now = new Date();
  const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  const post: FeedPost = {
    id: `post-created-${createdPosts.length + 1}`,
    tag: input.tag,
    author: { name: "Caro", initial: "C" },
    time,
    authorNote: "publicado por vos",
    audience: input.audience,
    body: input.body,
    likes: 0,
    comments: 0,
  };

  createdPosts.unshift(post);
  return post;
}

export function getAllFeedPosts(): FeedPost[] {
  return [...createdPosts, ...feedPosts];
}
