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
      analytics: {
        Row: {
          action: string
          additionalmetadata: string | null
          analyticsid: string
          timestamp: string | null
          userid: string | null
        }
        Insert: {
          action: string
          additionalmetadata?: string | null
          analyticsid?: string
          timestamp?: string | null
          userid?: string | null
        }
        Update: {
          action?: string
          additionalmetadata?: string | null
          analyticsid?: string
          timestamp?: string | null
          userid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_userid_fkey"
            columns: ["userid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["userid"]
          }
        ]
      }
      generatedcontent: {
        Row: {
          contentbody: string
          contentid: string
          contenttitle: string
          contenttype: string
          noteid: string | null
        }
        Insert: {
          contentbody: string
          contentid?: string
          contenttitle: string
          contenttype: string
          noteid?: string | null
        }
        Update: {
          contentbody?: string
          contentid?: string
          contenttitle?: string
          contenttype?: string
          noteid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "generatedcontent_noteid_fkey"
            columns: ["noteid"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["noteid"]
          }
        ]
      }
      notes: {
        Row: {
          notecontent: string
          noteid: string
          notetitle: string
          subjectid: string | null
          userid: string | null
        }
        Insert: {
          notecontent: string
          noteid?: string
          notetitle: string
          subjectid?: string | null
          userid?: string | null
        }
        Update: {
          notecontent?: string
          noteid?: string
          notetitle?: string
          subjectid?: string | null
          userid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notes_subjectid_fkey"
            columns: ["subjectid"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["subjectid"]
          }
        ]
      }
      studentprogress: {
        Row: {
          contentid: string | null
          lastaccessed: string | null
          progressid: string
          progresspercentage: number | null
          userid: string | null
        }
        Insert: {
          contentid?: string | null
          lastaccessed?: string | null
          progressid?: string
          progresspercentage?: number | null
          userid?: string | null
        }
        Update: {
          contentid?: string | null
          lastaccessed?: string | null
          progressid?: string
          progresspercentage?: number | null
          userid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "studentprogress_contentid_fkey"
            columns: ["contentid"]
            isOneToOne: false
            referencedRelation: "generatedcontent"
            referencedColumns: ["contentid"]
          },
          {
            foreignKeyName: "studentprogress_userid_fkey"
            columns: ["userid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["userid"]
          }
        ]
      }
      subjects: {
        Row: {
          subjectid: string
          subjectname: string
        }
        Insert: {
          subjectid?: string
          subjectname: string
        }
        Update: {
          subjectid?: string
          subjectname?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          email: string
          password: string
          userid: string
          username: string
          usertype: string
        }
        Insert: {
          email: string
          password: string
          userid: string
          username: string
          usertype: string
        }
        Update: {
          email?: string
          password?: string
          userid?: string
          username?: string
          usertype?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_userid_fkey"
            columns: ["userid"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
