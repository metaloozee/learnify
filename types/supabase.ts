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
                Relationships: []
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
                    },
                ]
            }
            notes: {
                Row: {
                    notecontent: string
                    noteid: string
                    notetitle: string
                    subjectid: string | null
                    teacherid: string | null
                    updated_at: string | null
                }
                Insert: {
                    notecontent: string
                    noteid?: string
                    notetitle: string
                    subjectid?: string | null
                    teacherid?: string | null
                    updated_at?: string | null
                }
                Update: {
                    notecontent?: string
                    noteid?: string
                    notetitle?: string
                    subjectid?: string | null
                    teacherid?: string | null
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "notes_subjectid_fkey"
                        columns: ["subjectid"]
                        isOneToOne: false
                        referencedRelation: "subjects"
                        referencedColumns: ["subjectid"]
                    },
                    {
                        foreignKeyName: "notes_teacherid_fkey"
                        columns: ["teacherid"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["userid"]
                    },
                ]
            }
            "studentenrollment ": {
                Row: {
                    enrollmentid: string
                    subjectid: string
                    userid: string
                }
                Insert: {
                    enrollmentid?: string
                    subjectid: string
                    userid: string
                }
                Update: {
                    enrollmentid?: string
                    subjectid?: string
                    userid?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "studentenrollment _subjectid_fkey"
                        columns: ["subjectid"]
                        isOneToOne: false
                        referencedRelation: "subjects"
                        referencedColumns: ["subjectid"]
                    },
                    {
                        foreignKeyName: "studentenrollment _userid_fkey"
                        columns: ["userid"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["userid"]
                    },
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
                ]
            }
            subjects: {
                Row: {
                    description: string | null
                    subjectid: string
                    subjectname: string
                    teacherid: string | null
                }
                Insert: {
                    description?: string | null
                    subjectid?: string
                    subjectname: string
                    teacherid?: string | null
                }
                Update: {
                    description?: string | null
                    subjectid?: string
                    subjectname?: string
                    teacherid?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "subjects_teacherid_fkey"
                        columns: ["teacherid"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["userid"]
                    },
                ]
            }
            users: {
                Row: {
                    first_name: string | null
                    last_name: string | null
                    userid: string
                    username: string
                    usertype: string
                }
                Insert: {
                    first_name?: string | null
                    last_name?: string | null
                    userid: string
                    username: string
                    usertype: string
                }
                Update: {
                    first_name?: string | null
                    last_name?: string | null
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
                    },
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
    TableName extends PublicTableNameOrOptions extends {
        schema: keyof Database
    }
        ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
              Database[PublicTableNameOrOptions["schema"]]["Views"])
        : never = never,
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
    TableName extends PublicTableNameOrOptions extends {
        schema: keyof Database
    }
        ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
        : never = never,
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
    TableName extends PublicTableNameOrOptions extends {
        schema: keyof Database
    }
        ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
        : never = never,
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
        : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
    ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never
