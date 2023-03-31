import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Linking,
} from "react-native";
import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { getDoc, doc } from "firebase/firestore";
import { SafeAreaView, ActivityIndicator } from "react-native";
import { Entypo } from "@expo/vector-icons";
import AppButton from "../components/AppButton";
import { Ionicons } from "@expo/vector-icons";
import GetDirection from "../components/GetDirection";
import { Link } from "@react-navigation/native";

const StreetArtInfo = ({ route, navigation, locationBristol }) => {
  const [artInfo, setArtInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [newLocal, setNewLocal] = useState("");
  const { id } = route.params;
  const myLocation = `${locationBristol.latitude}, ${locationBristol.longitude}`;

  useEffect(() => {
    const testFunc = (id) => {
      setIsLoading(true);
      let docRef = doc(db, "art", id);
      return getDoc(docRef)
        .then((data) => {
          setArtInfo(data.data());
          setIsLoading(false);
          return data;
        })
        .then((data) => {
          const newLatLong = data.data().location_geopoint;
          setNewLocal(`${newLatLong.latitude},${newLatLong.longitude}`);
        });
    };
    testFunc(id);
  }, [id]);

  return (
    <SafeAreaView className="absolute w-full h-full bg-white">
      {isLoading ? (
        <View className="flex items-center justify-center flex-1">
          <ActivityIndicator size="large" color="#C13584" />
          <Text className="text-pink">loading</Text>
        </View>
      ) : (
        <View>
          <View className="flex items-center py-4 mb-2 h-max">
            <TouchableOpacity
              className="relative z-10 right-44"
              onPress={() => navigation.goBack()}
            >
              <Ionicons
                name="chevron-back-circle-outline"
                size={38}
                color="#C13584"
              />
            </TouchableOpacity>
            <Image
              className="flex items-center w-full h-72"
              src={artInfo.image}
            />
          </View>
          <View className="flex w-10/12 mx-auto">
            <View className=" rounded-3xl">
              <View className="flex items-center flex-column">
                <Text className="-mb-2 text-lg font-bold color-pink">
                  {artInfo.title ? artInfo.title : "Untitled"}
                </Text>
                <Text className="mt-1">
                  By {artInfo.artist ? artInfo.artist : "Unknown"}
                </Text>
                <Text className="mb-2 font-semibold text-stone-400">
                  {artInfo.date_created.toDate().toDateString()}
                </Text>
              </View>
              <ScrollView className="mb-2 overflow-scroll h-44">
                <Text className="text-lg text-justify">
                  {artInfo.description}
                </Text>
              </ScrollView>

              <Text className="mb-1 text-stone-400">
                <Entypo name="location-pin" size={20} color="#C13584" />
                {artInfo.address_building_number} {artInfo.address_street},{" "}
                {artInfo.address_city} {artInfo.address_postcode}
              </Text>
              <GetDirection from={myLocation} to={newLocal} />
            </View>

            {/* <View className="mt-3 text-stone-500">
              <AppButton
                title={"Comments"}
                icon={"message1"}
              />

              <AppButton
                title={"Get Direction"}
                handlePress={() => {}}
                primary={true}
                icon={"enviromento"}
              />
            </View> */}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default StreetArtInfo;
