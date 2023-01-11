import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  Animated,
} from "react-native";
const { width, height } = Dimensions.get("window");
import { getMovies } from "./api";
import Genres from "./Genres";
import Rating from "./Rating";

const SPACING = 10;
const ITEM_SIZE = width * 0.72;
const SPACER_ITEM_SIZE = (width - ITEM_SIZE) / 2;

const Loading = () => (
  <View style={styles.loadingContainer}>
    <Text style={styles.paragraph}>Loading...</Text>
  </View>
);

export default function App() {
  const [movies, setMovies] = useState([]);
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchData = async () => {
      const m = await getMovies();
      setMovies([{ key: "leff-spacer" }, ...m, { key: "right-spacer" }]);
    };

    if (movies.length === 0) {
      fetchData(movies);
    }
  }, [movies]);

  if (movies.length == 0) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Animated.FlatList
        showsHorizontalScrollIndicator={false}
        data={movies}
        keyExtractor={(item) => item.key}
        horizontal
        contentContainerStyle={{
          alignItems: "center",
        }}
        snapToInterval={ITEM_SIZE}
        bounces={false}
        decelerationRate={0}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => {
          if (!item.poster) {
            return (
              <View
                style={{
                  width: SPACER_ITEM_SIZE,
                  // backgroundColor: "red",
                  // height: 200,
                }}
              />
            );
          }
          const inputRange = [
            (index - 2) * ITEM_SIZE,
            (index - 1) * ITEM_SIZE,
            index * ITEM_SIZE,
          ];
          const translateY = scrollX.interpolate({
            inputRange,
            outputRange: [0, -50, 0],
          });
          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [1, 1.1, 1],
          });
          return (
            <View style={{ width: ITEM_SIZE }}>
              <Animated.View
                style={{
                  marginHorizontal: SPACING,
                  padding: SPACING * 2,
                  alignItems: "center",
                  backgroundColor: "white",
                  borderRadius: 34,
                  transform: [{ translateY }],
                }}
              >
                <Animated.Image
                  source={{ uri: item.poster }}
                  style={[styles.posterImage]}
                />
                <Text style={{ fontSize: 24 }} numberOfLines={1}>
                  {item.title}
                </Text>
                <Rating rating={item.rating} />
                <Genres genres={item.genres} />
                {/* <Text style={{ fontSize: 12 }} numberOfLines={3}>
                  {item.description}
                </Text> */}
              </Animated.View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  posterImage: {
    width: "100%",
    height: 300,
    marginBottom: SPACING,
    borderRadius: SPACING * 2,
  },
});
