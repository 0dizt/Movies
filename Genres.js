import * as React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Genres({ genres }) {
  return (
    <View style={styles.genres}>
      {genres.map((genre, index) => {
        return (
          <View key={genre} style={styles.genre}>
            <Text style={styles.genreText}>{genre}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  genres: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginVertical: 10,
  },
  genre: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#eee",
    paddingVertical: 3,
    paddingHorizontal: 10,
    margin: 2,
  },
  genreText: {
    fontSize: 11,
    color: "#777",
  },
});
