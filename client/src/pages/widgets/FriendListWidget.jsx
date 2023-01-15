import React, { useEffect } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { setFriends } from "state/authSlice";
import FlexBetween from "components/FlexBetween";

const FriendListWidget = ({ userId }) => {
    const dispatch = useDispatch();
    const { palette } = useTheme();
    const token = useSelector((state) => state.token);
    const friends = useSelector((state) => state.user.friends);
    const medium = palette.neutral.medium;
    const totalFriends = friends.length;

    const getFriends = async() => {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/users/${userId}/friends`, {
            method: "GET", 
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        dispatch(setFriends({ friends: data }));
    };

    useEffect(() => {
        getFriends();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    
    return (
        <WidgetWrapper>
            <FlexBetween sx={{ mb:"1.5rem" }}>
                <Typography
                    color={palette.neutral.dark}
                    variant="h5"
                    fontWeight="500"
                >
                    Friend List
                </Typography>
                <Typography color={medium}>{totalFriends}</Typography>
            </FlexBetween>
            <Box display="flex" flexDirection="column" gap="1.5rem">
                {friends?.map((friend) => (
                    <Friend
                        key={friend._id}
                        friendId={friend._id}
                        name={`${friend.firstName} ${friend.lastName}`}
                        subtitle={friend.occupation}
                        userPicturePath={friend.picturePath}
                    />
                ))}
            </Box>
        </WidgetWrapper>
    );
};

export default FriendListWidget;