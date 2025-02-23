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
      articles: {
        Row: {
          audio_url: string | null
          content: string | null
          created_at: string | null
          feed_id: string
          feed_title: string | null
          id: string
          listened: boolean | null
          published_at: string
          title: string
          transcript: string | null
          updated_at: string | null
          url: string
        }
        Insert: {
          audio_url?: string | null
          content?: string | null
          created_at?: string | null
          feed_id: string
          feed_title?: string | null
          id?: string
          listened?: boolean | null
          published_at?: string
          title: string
          transcript?: string | null
          updated_at?: string | null
          url: string
        }
        Update: {
          audio_url?: string | null
          content?: string | null
          created_at?: string | null
          feed_id?: string
          feed_title?: string | null
          id?: string
          listened?: boolean | null
          published_at?: string
          title?: string
          transcript?: string | null
          updated_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "articles_feed_id_fkey"
            columns: ["feed_id"]
            isOneToOne: false
            referencedRelation: "feeds"
            referencedColumns: ["id"]
          },
        ]
      }
      curated_feeds: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          title: string
          url: string
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          title: string
          url: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          title?: string
          url?: string
        }
        Relationships: []
      }
      feeds: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          last_fetched: string | null
          title: string | null
          updated_at: string | null
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          last_fetched?: string | null
          title?: string | null
          updated_at?: string | null
          url: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          last_fetched?: string | null
          title?: string | null
          updated_at?: string | null
          url?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          elevenlabs_api_key: string | null
          full_name: string | null
          gemini_api_key: string | null
          id: string
          system_prompt: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          elevenlabs_api_key?: string | null
          full_name?: string | null
          gemini_api_key?: string | null
          id: string
          system_prompt?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          elevenlabs_api_key?: string | null
          full_name?: string | null
          gemini_api_key?: string | null
          id?: string
          system_prompt?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      radio_feeds: {
        Row: {
          created_at: string | null
          id: string
          radio_station_id: string
          title: string
          url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          radio_station_id: string
          title: string
          url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          radio_station_id?: string
          title?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "radio_feeds_radio_station_id_fkey"
            columns: ["radio_station_id"]
            isOneToOne: false
            referencedRelation: "radio_stations"
            referencedColumns: ["id"]
          },
        ]
      }
      radio_stations: {
        Row: {
          category: Database["public"]["Enums"]["radio_category"] | null
          created_at: string | null
          id: string
          image_url: string | null
          name: string
          tags: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["radio_category"] | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          name: string
          tags?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: Database["public"]["Enums"]["radio_category"] | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          name?: string
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_radio_categories: {
        Args: Record<PropertyKey, never>
        Returns: {
          category: string
        }[]
      }
    }
    Enums: {
      radio_category:
        | "News"
        | "Technology"
        | "Business"
        | "Entertainment"
        | "Sports"
        | "Science"
        | "Education"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
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
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
