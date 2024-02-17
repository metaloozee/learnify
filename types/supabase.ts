export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
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
                    studentid: string | null
                }
                Insert: {
                    contentbody: string
                    contentid?: string
                    contenttitle: string
                    contenttype: string
                    noteid?: string | null
                    studentid?: string | null
                }
                Update: {
                    contentbody?: string
                    contentid?: string
                    contenttitle?: string
                    contenttype?: string
                    noteid?: string | null
                    studentid?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "generatedcontent_noteid_fkey"
                        columns: ["noteid"]
                        isOneToOne: false
                        referencedRelation: "notes"
                        referencedColumns: ["noteid"]
                    },
                    {
                        foreignKeyName: "generatedcontent_studentid_fkey"
                        columns: ["studentid"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["userid"]
                    },
                ]
            }
            notes: {
                Row: {
                    is_published: boolean
                    notecontent: string
                    noteid: string
                    notetitle: string
                    subjectid: string | null
                    teacherid: string | null
                    updated_at: string | null
                }
                Insert: {
                    is_published?: boolean
                    notecontent: string
                    noteid?: string
                    notetitle: string
                    subjectid?: string | null
                    teacherid?: string | null
                    updated_at?: string | null
                }
                Update: {
                    is_published?: boolean
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
            qna: {
                Row: {
                    answer: string
                    graded: boolean | null
                    id: string
                    noteid: string
                    question: string
                    studentid: string
                }
                Insert: {
                    answer: string
                    graded?: boolean | null
                    id?: string
                    noteid: string
                    question: string
                    studentid: string
                }
                Update: {
                    answer?: string
                    graded?: boolean | null
                    id?: string
                    noteid?: string
                    question?: string
                    studentid?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "qna_noteid_fkey"
                        columns: ["noteid"]
                        isOneToOne: false
                        referencedRelation: "notes"
                        referencedColumns: ["noteid"]
                    },
                    {
                        foreignKeyName: "qna_studentid_fkey"
                        columns: ["studentid"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["userid"]
                    },
                ]
            }
            studentenrollment: {
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
                        foreignKeyName: "studentenrollment_subjectid_fkey"
                        columns: ["subjectid"]
                        isOneToOne: false
                        referencedRelation: "subjects"
                        referencedColumns: ["subjectid"]
                    },
                    {
                        foreignKeyName: "studentenrollment_userid_fkey"
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
                    {
                        foreignKeyName: "studentprogress_userid_fkey"
                        columns: ["userid"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["userid"]
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
            match_page_sections: {
                Args: {
                    embedding: string
                    match_threshold: number
                    match_count: number
                    min_content_length: number
                }
                Returns: {
                    noteid: string
                    notecontent: string
                    similarity: number
                }[]
            }
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
