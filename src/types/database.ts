
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      options: {
        Row: {
          id: string
          poll_id: string
          label: string
        }
        Insert: {
          id?: string
          poll_id: string
          label: string
        }
        Update: {
          id?: string
          poll_id?: string
          label?: string
        }
        Relationships: [
          {
            foreignKeyName: "options_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          }
        ]
      }
      polls: {
        Row: {
          id: string
          user_id: string
          title: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "polls_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      votes: {
        Row: {
          id: number
          poll_id: string
          option_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: never
          poll_id: string
          option_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: never
          poll_id?: string
          option_id?: string
          user_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "votes_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      option_votes: {
        Row: {
          option_id: string | null
          poll_id: string | null
          label: string | null
          votes_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "options_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Functions: {}
    Enums: {}
  }
}
