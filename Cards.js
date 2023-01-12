import { Animated, StyleSheet, Text, View, Image } from "react-native";
import React, { memo } from "react";
import Genres from "./Genres";
import Rating from "./Rating";

class Cards extends React.PureComponent {
  render() {
    const { item, index, translateY, scale, SPACING, ITEM_SIZE } = this.props;

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
          <Animated.View
            style={{
              overflow: "hidden",
              width: "100%",
              height: 300,
              borderRadius: SPACING * 2,
            }}
          >
            <Animated.Image
              source={{ uri: item.poster }}
              style={{
                width: "100%",
                height: "100%",
                marginBottom: SPACING,
                borderRadius: SPACING * 2,
                transform: [{ scale }],
              }}
            />
          </Animated.View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "500",
              marginTop: 10,
              color: "black",
            }}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <Genres genres={item.genres} />
          <Rating rating={item.rating} />
          {/* <Text style={{ fontSize: 12 }} numberOfLines={3}>
            {item.description}
          </Text> */}
        </Animated.View>
      </View>
    );
  }
}

export default Cards;
