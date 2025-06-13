import CallRoundedIcon from "@mui/icons-material/CallRounded";
import CircleIcon from "@mui/icons-material/Circle";
import MicRoundedIcon from "@mui/icons-material/MicRounded";
import VideoCallRoundedIcon from "@mui/icons-material/VideoCallRounded";
import { parseCookies } from "nookies";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { chatStore, dialogStore } from "../../../../store/reducers";
import {
  ChatAreaStyle,
  ChatInputStyle,
  DisplayChatStyle,
  HeadingStyle,
  UserHeadingStyle,
} from "./styles";

import SendIcon from "@mui/icons-material/Send";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  FormControl,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { AssemblyAI } from "assemblyai";
import { selectSelectedUserUUID } from "../../../../store/reducers/user.reducer";
import LineChat from "../LineChat";

import { Client, Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { SOCKET_URL } from "../../../../Path/backend";
import { ChatResponse } from "../../../../store/reducers/chat.reducer";
import { useTranslation } from "react-i18next";

const ChatArea: React.FC = () => {
  const { t } = useTranslation();
  const [historyMessage, setHistoryMessage] = useState<ChatResponse | null>();
  const [newMessage, setNewMessage] = useState("");
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();
  const chatList = useSelector(chatStore.selectChatList);
  const voiceLoading = useSelector(dialogStore.selectVoiceLoading);

  const selectedUserUUID: {
    online: boolean;
    uuid: string;
    username: string;
    avatar: string;
  } | null = useSelector(selectSelectedUserUUID);
  const cookies = parseCookies();
  let uuid = cookies["uuid"];
  const getChat = async () => {
    if (selectedUserUUID !== null) {
      dispatch(
        chatStore.sagaGetList({
          senderUUID: uuid,
          receiverUUID: selectedUserUUID.uuid,
        })
      );
      setHistoryMessage(chatList);
    }
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [historyMessage]);
  useEffect(() => {
    setHistoryMessage(chatList);
  }, [chatList]);

  useEffect(() => {
    getChat();
    const socket = new SockJS(SOCKET_URL);
    const stompClient = Stomp.over(socket);

    // Function to handle successful connection
    const onConnect = () => {
      stompClient.subscribe(
        `/user/${uuid}/queue/messages/${selectedUserUUID?.uuid}`,
        (message) => {
          const chatMessage = JSON.parse(message.body);
          setHistoryMessage(chatMessage);
        }
      );
    };

    // Connect with error handling
    stompClient.connect({}, onConnect);
    setStompClient(stompClient);
    return () => {
      if (stompClient) {
        stompClient.deactivate();
      }
    };
  }, [selectedUserUUID]);

  const sendMessage = async () => {
    if (stompClient && newMessage.trim() && selectedUserUUID) {
      const chatMessage = {
        senderUUID: { uuid: uuid }, // Create a User object for sender
        receiverUUID: { uuid: selectedUserUUID.uuid }, // Create a User object for receiver
        threads: [
          {
            senderUUID: uuid,
            content: {
              message: newMessage, // Actual message text
              timeStamps: new Date().toISOString,
            },
            lastUploadedAt: new Date().toISOString,
          },
        ],
      };
      // const isMessageValid = await checkToxicLanguage(newMessage); // Await response directly
      // if (isMessageValid) {
      stompClient.publish({
        destination: "/app/chat",
        body: JSON.stringify(chatMessage),
      });
      setNewMessage("");
      getChat();
      // } else {
      //   console.warn("Toxic language detected, message not sent.");
      // }
    } else {
      console.error("STOMP client is not connected.");
    }
  };
  const checkToxicLanguage = async (message: string) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_LLM}ToxicLanguage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
        }
      );

      if (!response.ok) {
        console.error(
          `Failed to check toxic language. Status: ${response.status}`
        );
        return false;
      }

      const { passValidate } = await response.json();
      return passValidate; // Directly return the value without extra variable creation
    } catch (error) {
      console.error("Error checking toxic language:", error);
      return false;
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(event.target.value); // Set the new message
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };
  const [isRecording, setIsRecording] = useState(false);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [transcriptionClient, setTranscriptionClient] =
    useState<AssemblyAI | null>(null);
  const [transcript, setTranscript] = useState<string>("");
  useEffect(() => {
    const client = new AssemblyAI({
      apiKey: "1c0ac34eb4d542f8996c0310042be8fd",
    });
    setTranscriptionClient(client);
  }, []);

  // New method for real-time transcription
  const startRecording = async () => {
    dispatch(dialogStore.setVoiceLoading(true)); // set voice loading
    setTranscript("");
    setNewMessage("");
    if (!transcriptionClient) {
      console.error("Transcription client is not initialized.");
      return;
    }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    setAudioStream(stream);

    // Create a MediaRecorder
    const recorder = new MediaRecorder(stream);
    setMediaRecorder(recorder);

    const audioChunks: Blob[] = [];

    recorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    recorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/wav" });

      // Send audio to AssemblyAI for transcription
      const response = await transcriptionClient.transcripts.transcribe({
        audio: audioBlob,
      });
      if (response) {
        setTranscript(response.text || "");
      }

      // Set loading to false after receiving the response
      dispatch(dialogStore.setVoiceLoading(false));
    };
    recorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (!mediaRecorder) {
      console.warn("MediaRecorder is not initialized.");
      return;
    }

    if (mediaRecorder.state === "recording") {
      mediaRecorder.stop(); // Stop the recorder
      setIsRecording(false); // Update the recording state
      if (audioStream) {
        // Stop all tracks in the audio stream
        audioStream.getTracks().forEach((track) => track.stop());
        setAudioStream(null);
      }

      setMediaRecorder(null); // Reset media recorder
    } else {
      console.warn(
        "No active recording to stop. Current state:",
        mediaRecorder.state
      );
    }
  };

  useEffect(() => {
    if (transcript) {
      setNewMessage(transcript);
    }
  }, [transcript]);
  return (
    <ChatAreaStyle>
      <HeadingStyle>
        {selectedUserUUID !== null ? (
          <UserHeadingStyle>
            <Avatar src={selectedUserUUID.avatar} alt="photoURL" />
            {selectedUserUUID.online === true ? (
              <CircleIcon
                sx={{
                  fontSize: 12,
                  color: "#4caf50",
                  position: "absolute",
                  marginLeft: 3,
                  marginTop: 4,
                }}
              />
            ) : null}

            <Typography
              variant="subtitle1"
              style={{ margin: "0px 10px", color: "black", fontSize: "20px" }}
            >
              {selectedUserUUID?.username}
            </Typography>
            <Box
              sx={{
                marginRight: 0,
                marginLeft: "auto",
              }}
            >
              <CallRoundedIcon
                sx={{
                  color: "black",
                  marginRight: 2,
                  fontSize: "30px",
                }}
              />
              <VideoCallRoundedIcon
                sx={{
                  color: "black",
                  fontSize: "30px",
                }}
              />
            </Box>
          </UserHeadingStyle>
        ) : null}
      </HeadingStyle>

      <DisplayChatStyle ref={chatRef}>
        {historyMessage !== null
          ? historyMessage?.threads
              // .slice()
              // .reverse()
              .map((thread, index) => (
                <LineChat
                  key={index}
                  message={thread.content?.message || ""}
                  senderUUID={thread.senderUUID}
                  timestamps={thread?.timeStamps}
                />
              ))
          : null}
      </DisplayChatStyle>
      {selectedUserUUID !== null ? (
        <ChatInputStyle>
          <MicRoundedIcon
            sx={{
              backgroundColor: isRecording ? "#66FF00" : "#0070BB",
              borderRadius: "30%",
              // padding: 3,
              fontSize: "40px",
              transition: "background-color 0.3s ease",
              "&:hover": {
                backgroundColor: isRecording ? "#00B9E8" : "#003262",
              },
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
            onClick={isRecording ? stopRecording : startRecording}
          />
          <FormControl fullWidth sx={{ m: 1 }}>
            {voiceLoading && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 1,
                }}
              >
                <CircularProgress size={20} />
              </div>
            )}
            <OutlinedInput
              id="outlined-adornment-amount"
              value={newMessage}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={t("chat.typeMessage")}
              disabled={voiceLoading}
              sx={{ opacity: voiceLoading ? 0.3 : 1 }}
            />
          </FormControl>
          <Button
            onClick={sendMessage}
            variant="contained"
            endIcon={<SendIcon />}
          >
            {t("chat.send")}
          </Button>
        </ChatInputStyle>
      ) : null}
    </ChatAreaStyle>
  );
};

export default ChatArea;
