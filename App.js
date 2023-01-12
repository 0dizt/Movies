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
  TouchableOpacity,
} from "react-native";
const { width, height } = Dimensions.get("window");
import { getMovies } from "./api";
import MaskedView from "@react-native-masked-view/masked-view";
import Svg, { Rect } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import Cards from "./Cards";

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const SPACING = 10;
const ITEM_SIZE = width * 0.72;
const SPACER_ITEM_SIZE = (width - ITEM_SIZE) / 2;
const BACKDROP_HEIGHT = height * 0.6;

const Loading = () => (
  <View style={styles.loadingContainer}>
    <Text style={styles.paragraph}>Loading...</Text>
  </View>
);

const Backdrop = ({ movies, scrollX }) => {
  return (
    <View style={{ position: "absolute", width, height: BACKDROP_HEIGHT }}>
      <FlatList
        data={movies}
        keyExtractor={(item) => item.key}
        renderItem={({ item, index }) => {
          if (!item.backdrop) return null;

          const inputRange = [(index - 2) * ITEM_SIZE, (index - 1) * ITEM_SIZE];

          const translateX = scrollX.interpolate({
            inputRange,
            outputRange: [-width, 0],
          });
          return (
            <>
              <MaskedView
                style={{ position: "absolute" }}
                maskElement={
                  <AnimatedSvg
                    width={width}
                    height={height}
                    viewBox={`0 0 ${width} ${height}`}
                    style={{ transform: [{ translateX }] }}
                  >
                    <Rect
                      x="0"
                      y="0"
                      width={width}
                      height={height}
                      fill="red"
                    />
                  </AnimatedSvg>
                }
              >
                <Image
                  source={{ uri: item.backdrop }}
                  style={{
                    width,
                    height: BACKDROP_HEIGHT,
                    resizeMode: "cover",
                  }}
                />
              </MaskedView>
              {/* <Image
                source={{ uri: item.backdrop }}
                style={{ width, height: BACKDROP_HEIGHT, resizeMode: "cover" }}
              /> */}
            </>
          );
        }}
      />
      <LinearGradient
        colors={["#00000050", "white"]}
        style={{
          width,
          height: BACKDROP_HEIGHT,
          position: "absolute",
          bottom: 0,
        }}
      />
    </View>
  );
};

const BuyTicket = () => {
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 50,
      }}
    >
      <TouchableOpacity
        style={{
          backgroundColor: "black",
          paddingHorizontal: 50,
          paddingVertical: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 14,
            textTransform: "uppercase",
            fontWeight: "500",
            color: "white",
          }}
        >
          Buy Ticket
        </Text>
      </TouchableOpacity>
    </View>
  );
};

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

  const renderItem = ({ item, index }) => {
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
      outputRange: [100, 50, 100],
    });
    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [1.5, 1, 1.5],
    });
    return (
      <Cards
        item={item}
        index={index}
        translateY={translateY}
        scale={scale}
        SPACING={SPACING}
        ITEM_SIZE={ITEM_SIZE}
      />
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Backdrop movies={movies} scrollX={scrollX} />
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
        renderItem={renderItem}
      />
      <BuyTicket />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    // alignItems: "center",
    // justifyContent: "center",
  },
  posterImage: {
    width: "100%",
    height: "100%",
    marginBottom: SPACING,
    borderRadius: SPACING * 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
