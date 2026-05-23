export const api = window.api

export interface TopicSummary {
  id: number
  title: string
  domain: string | null
  author: string | null
  points: number
  comments_count: number
  posted_at: string | null
  tags: string[]
  auto_tags: string[]
  favorited: boolean
  relPath: string
}
export interface TopicDetail extends TopicSummary {
  url: string | null
  content: string
  commentsMarkdown: string | null
  related: string[]
}
