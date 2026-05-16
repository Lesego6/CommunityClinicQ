import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import Svg, { Path, Circle } from "react-native-svg";
import { Colors } from "../../constants/colors";
import { ClinicQLogo } from "../../components/ui/ClinicQLogo";

function BackIcon({ size = 22 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M19 12H5M12 19L5 12L12 5" stroke={Colors.dark} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function StarIcon({ size = 16, filled = true }: { size?: number; filled?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? Colors.yellow : Colors.border}>
      <Path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill={filled ? Colors.yellow : Colors.border} />
    </Svg>
  );
}

function ThumbsUpIcon({ size = 14, color = Colors.muted }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" stroke={color} strokeWidth={2} />
      <Path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" stroke={color} strokeWidth={2} />
    </Svg>
  );
}

interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
  helpful: number;
  tags: string[];
}

const INITIAL_REVIEWS: Review[] = [
  {
    id: "r1",
    author: "Nomsa T.",
    avatar: "NT",
    rating: 5,
    date: "12 May 2026",
    text: "The staff were very friendly and professional. I was seen quickly and the doctor explained everything clearly. The queue system worked perfectly — I got a notification when it was almost my turn.",
    helpful: 24,
    tags: ["Friendly staff", "Short wait", "Clean facility"],
  },
  {
    id: "r2",
    author: "Sipho M.",
    avatar: "SM",
    rating: 4,
    date: "08 May 2026",
    text: "Good service overall. The clinic was clean and well-organised. The only downside was the wait time was a bit longer than estimated, but the nurses were very helpful.",
    helpful: 18,
    tags: ["Clean facility", "Helpful nurses"],
  },
  {
    id: "r3",
    author: "Ayanda K.",
    avatar: "AK",
    rating: 5,
    date: "03 May 2026",
    text: "Excellent experience! The CliniqQ app made it so easy to join the queue remotely. By the time I arrived, I only waited 10 minutes. The pharmacy was also well-stocked.",
    helpful: 31,
    tags: ["Short wait", "Good pharmacy", "App works great"],
  },
  {
    id: "r4",
    author: "Thandi N.",
    avatar: "TN",
    rating: 3,
    date: "28 Apr 2026",
    text: "Average experience. The clinic was busy and the wait was long. Staff were okay but seemed overwhelmed. Hopefully it improves.",
    helpful: 7,
    tags: ["Long wait"],
  },
  {
    id: "r5",
    author: "Bongani D.",
    avatar: "BD",
    rating: 5,
    date: "20 Apr 2026",
    text: "I've been coming here for my chronic medication for years. The service has improved a lot since they introduced the queue app. Highly recommend.",
    helpful: 42,
    tags: ["Chronic care", "Improved service"],
  },
];

function RatingBar({ stars, percent }: { stars: number; percent: number }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 }}>
      <Text style={{ fontSize: 12, color: Colors.muted, width: 14 }}>{stars}</Text>
      <StarIcon size={11} filled />
      <View style={{ flex: 1, height: 6, backgroundColor: Colors.border, borderRadius: 3 }}>
        <View style={{ height: 6, backgroundColor: Colors.yellow, borderRadius: 3, width: `${percent}%` }} />
      </View>
      <Text style={{ fontSize: 11, color: Colors.muted, width: 32 }}>{percent}%</Text>
    </View>
  );
}

function ReviewCard({ review, onHelpful }: { review: Review; onHelpful: (id: string) => void }) {
  return (
    <View style={{ backgroundColor: Colors.white, borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 1 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primaryLight, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontSize: 14, fontWeight: "700", color: Colors.primary }}>{review.avatar}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 13, fontWeight: "700", color: Colors.dark }}>{review.author}</Text>
          <Text style={{ fontSize: 11, color: Colors.muted }}>{review.date}</Text>
        </View>
        <View style={{ flexDirection: "row", gap: 2 }}>
          {[1, 2, 3, 4, 5].map((s) => (
            <StarIcon key={s} size={13} filled={s <= review.rating} />
          ))}
        </View>
      </View>

      <Text style={{ fontSize: 13, color: Colors.darkMid, lineHeight: 19, marginBottom: 10 }}>{review.text}</Text>

      {/* Tags */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
        {review.tags.map((tag) => (
          <View key={tag} style={{ backgroundColor: Colors.primaryLight, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 }}>
            <Text style={{ fontSize: 11, fontWeight: "600", color: Colors.primary }}>{tag}</Text>
          </View>
        ))}
      </View>

      {/* Helpful */}
      <TouchableOpacity
        onPress={() => onHelpful(review.id)}
        style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
      >
        <ThumbsUpIcon size={14} color={Colors.muted} />
        <Text style={{ fontSize: 12, color: Colors.muted }}>Helpful ({review.helpful})</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function ReviewsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [showAddReview, setShowAddReview] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newText, setNewText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState<"recent" | "helpful">("recent");

  const avgRating = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);

  const handleHelpful = (id: string) => {
    setReviews((prev) => prev.map((r) => r.id === id ? { ...r, helpful: r.helpful + 1 } : r));
  };

  const handleSubmitReview = () => {
    if (newRating === 0) {
      Alert.alert("Rating required", "Please select a star rating before submitting.");
      return;
    }
    if (newText.trim().length < 10) {
      Alert.alert("Review too short", "Please write at least 10 characters.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      const newReview: Review = {
        id: `r${Date.now()}`,
        author: "You",
        avatar: "YO",
        rating: newRating,
        date: "Just now",
        text: newText.trim(),
        helpful: 0,
        tags: [],
      };
      setReviews((prev) => [newReview, ...prev]);
      setNewRating(0);
      setNewText("");
      setSubmitting(false);
      setShowAddReview(false);
      Alert.alert("Review submitted!", "Thank you for your feedback.", [{ text: "OK" }]);
    }, 1200);
  };

  const sorted = [...reviews].sort((a, b) =>
    sortBy === "helpful" ? b.helpful - a.helpful : 0
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.surface }} edges={["top"]}>
      {/* Header */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingVertical: 12, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border }}>
        <TouchableOpacity onPress={() => router.back()}>
          <BackIcon size={22} />
        </TouchableOpacity>
        <ClinicQLogo size={28} />
        <TouchableOpacity
          onPress={() => setShowAddReview(true)}
          style={{ backgroundColor: Colors.primary, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6 }}
        >
          <Text style={{ color: Colors.white, fontSize: 12, fontWeight: "700" }}>+ Review</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 16 }}>
        {/* Rating summary */}
        <View style={{ backgroundColor: Colors.white, borderRadius: 20, padding: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 }}>
          <Text style={{ fontSize: 16, fontWeight: "700", color: Colors.dark, marginBottom: 14 }}>Langa Community Clinic</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 48, fontWeight: "900", color: Colors.dark }}>{avgRating}</Text>
              <View style={{ flexDirection: "row", gap: 2, marginTop: 2 }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <StarIcon key={s} size={14} filled={s <= Math.round(parseFloat(avgRating))} />
                ))}
              </View>
              <Text style={{ fontSize: 11, color: Colors.muted, marginTop: 4 }}>({reviews.length} reviews)</Text>
            </View>
            <View style={{ flex: 1 }}>
              <RatingBar stars={5} percent={78} />
              <RatingBar stars={4} percent={14} />
              <RatingBar stars={3} percent={5} />
              <RatingBar stars={2} percent={2} />
              <RatingBar stars={1} percent={1} />
            </View>
          </View>
        </View>

        {/* Sort + count */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ fontSize: 14, fontWeight: "600", color: Colors.dark }}>{reviews.length} reviews</Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {(["recent", "helpful"] as const).map((s) => (
              <TouchableOpacity
                key={s}
                onPress={() => setSortBy(s)}
                style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: sortBy === s ? Colors.primary : Colors.white, borderWidth: 1, borderColor: sortBy === s ? Colors.primary : Colors.border }}
              >
                <Text style={{ fontSize: 12, fontWeight: "600", color: sortBy === s ? Colors.white : Colors.muted }}>
                  {s === "recent" ? "Most recent" : "Most helpful"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Reviews list */}
        {sorted.map((review) => (
          <ReviewCard key={review.id} review={review} onHelpful={handleHelpful} />
        ))}

        {/* Write review CTA */}
        <TouchableOpacity
          onPress={() => setShowAddReview(true)}
          style={{ backgroundColor: Colors.primaryLight, borderRadius: 16, padding: 16, alignItems: "center", borderWidth: 1, borderColor: Colors.primary + "30" }}
        >
          <Text style={{ fontSize: 14, fontWeight: "700", color: Colors.primary }}>Write a Review</Text>
          <Text style={{ fontSize: 12, color: Colors.muted, marginTop: 4 }}>Share your experience to help others</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Add Review Modal */}
      <Modal visible={showAddReview} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }} edges={["top"]}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: Colors.border }}>
            <TouchableOpacity onPress={() => setShowAddReview(false)}>
              <Text style={{ fontSize: 15, color: Colors.muted }}>Cancel</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 17, fontWeight: "700", color: Colors.dark }}>Write a Review</Text>
            <View style={{ width: 50 }} />
          </View>

          <ScrollView contentContainerStyle={{ padding: 20, gap: 20 }}>
            <Text style={{ fontSize: 15, fontWeight: "700", color: Colors.dark }}>Langa Community Clinic</Text>

            {/* Star rating */}
            <View>
              <Text style={{ fontSize: 14, fontWeight: "600", color: Colors.dark, marginBottom: 10 }}>Your rating</Text>
              <View style={{ flexDirection: "row", gap: 8 }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <TouchableOpacity key={s} onPress={() => setNewRating(s)}>
                    <StarIcon size={36} filled={s <= newRating} />
                  </TouchableOpacity>
                ))}
              </View>
              {newRating > 0 && (
                <Text style={{ fontSize: 13, color: Colors.muted, marginTop: 6 }}>
                  {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][newRating]}
                </Text>
              )}
            </View>

            {/* Review text */}
            <View>
              <Text style={{ fontSize: 14, fontWeight: "600", color: Colors.dark, marginBottom: 8 }}>Your review</Text>
              <TextInput
                value={newText}
                onChangeText={setNewText}
                placeholder="Share your experience at this clinic..."
                placeholderTextColor={Colors.muted}
                multiline
                numberOfLines={5}
                style={{ backgroundColor: Colors.surface, borderRadius: 14, padding: 14, fontSize: 14, color: Colors.dark, borderWidth: 1, borderColor: Colors.border, minHeight: 120, textAlignVertical: "top" }}
              />
              <Text style={{ fontSize: 11, color: Colors.muted, marginTop: 4 }}>{newText.length} / 500 characters</Text>
            </View>

            <TouchableOpacity
              onPress={handleSubmitReview}
              disabled={submitting}
              style={{ backgroundColor: Colors.primary, borderRadius: 16, paddingVertical: 16, alignItems: "center", opacity: submitting ? 0.7 : 1 }}
            >
              <Text style={{ color: Colors.white, fontSize: 16, fontWeight: "700" }}>
                {submitting ? "Submitting..." : "Submit Review"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
