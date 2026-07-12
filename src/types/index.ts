export type Post = {
  account_id: string
  text: string
  timestamp: string
}

export type DatasetStats = {
  totalPosts: number
  uniqueAccounts: number
  earliestPost: string
  latestPost: string
}