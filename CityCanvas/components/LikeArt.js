import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { db } from "../firebaseConfig";
import { doc, updateDoc, increment } from "firebase/firestore";

const LikeArt = ({ itemId, item }) => {
	const [likes, setLikes] = useState(0);
	const incLikes = () => {
		const likesRef = doc(db, "art", itemId);
		updateDoc(likesRef, { likes_count: increment(1) });
		return likesRef;
	};

	return (
		<TouchableOpacity
			onPress={() => {
				incLikes();
				alert("You liked it");
			}}
		>
			<Text className="absolute bottom-0 right-0 p-1 ">
				<AntDesign name="heart" size={20} color="#C13584" />{" "}
				<Text className="font-semibold">{item.likes_count} </Text>
			</Text>
		</TouchableOpacity>
	);
};

export default LikeArt;
