import { useQuery, gql, useMutation } from "@apollo/client";
import axios from "axios";
import { PresenceChannel } from "laravel-echo/dist/channel";
import withRouter, { WithRouterProps } from "next/dist/client/with-router";
import React, {
  forwardRef,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  AiOutlineInfo,
  AiOutlineSetting,
  AiFillCloseCircle,
} from "react-icons/ai";
import { BiMessageAltDetail } from "react-icons/bi";
import { BsCameraVideoFill, BsMicFill, BsMicMute } from "react-icons/bs";
import { FaChalkboard, FaUpload, FaUserFriends } from "react-icons/fa";
import { MdClose, MdPresentToAll, MdSend } from "react-icons/md";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import ImageContainer from "../../components/Container/ImageContainer";
import { SelectValue } from "../../components/Forms/Form";
import SearchBox from "../../components/SearchBox";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import echo from "../../services/echo";
import { useUserStore } from "../../store/user";
import { Meeting } from "../../types/type";
import Peer from "simple-peer";
import { SimpleSelect } from "../../components/SimpleSelect";
const iceConfig = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

const IconButton = ({
  children,
  onClick,
  active,
}: {
  active?: boolean;
  children: ReactNode;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className={`h-12 w-12 rounded-full  flex items-center justify-center ${
      active ? "bg-gray-300 hover:bg-gray-400" : "bg-gray-600 hover:bg-gray-500"
    }`}
  >
    {children}
  </button>
);

function Id({ router }: WithRouterProps) {
  const { id } = router.query;
  const { user } = useUserStore();
  const {
    data: { meeting } = {},
    loading,
    error,
  } = useQuery<{ meeting: Meeting }>(
    gql`
      query GetMeeting($id: ID!) {
        meeting(id: $id) {
          id
          created_at
          updated_at
          name
          uuid
          metadata {
            attachment_id
            attachment_type
            media
            description
            content_type
            content
          }
          classroom {
            id
            created_at
            updated_at
            name
            user {
              id
              name
            }
          }
          finish_at
          open_at
        }
      }
    `,
    {
      variables: {
        id,
      },
      onCompleted: async ({ meeting }) => {
        const presence = echo.join(`meeting.${meeting.id}`);

        //@ts-ignore
        channel.current = presence;

        presence.listen("RTCNegotiation", async (e: any) => {
          const data = e.data;
          if (user?.id == e.user_id) return;
          if (e.type == "new-ice-candidate") {
          }
          if (e.type == "offer") {
          }

          if (e.type == "callUser") {
            // const stream = await getCaptureWebcam({
            //   video: true,
            // });

            setStreamType("video");
            const signal = e.data;
            setSignal(signal);
            const peer = new Peer({
              initiator: false,
              trickle: false,
              stream: new MediaStream(),
            });
            peer.on("signal", (data) => {
              HandleRTC({
                variables: {
                  id,
                  type: "answerCall",
                  data: JSON.stringify(data),
                },
              }).then((e) => {
                HandleRTC({
                  variables: {
                    id,
                    type: "callAccepted",
                    data: JSON.stringify(data),
                  },
                });
              });
            });
            peer.on("stream", (stream) => {
              if (videoRef.current) videoRef.current.srcObject = stream;
            });

            peer.signal(signal);
          }
        });
      },
    }
  );

  const channel = useRef<PresenceChannel>(null);

  const [HandleRTC] = useMutation(gql`
    mutation MeetingRTCNegotiationMutation(
      $id: ID!
      $data: String
      $type: String!
    ) {
      MeetingRTCNegotiation(meeting_id: $id, data: $data, type: $type) {
        status
        message
      }
    }
  `);

  const [openLeftMenu, setOpenLeftMenu] = useState<
    "" | "Setting" | "Participant" | "Info" | "Chat" | "Document"
  >("");
  const { width } = useWindowDimensions();

  const getCaptureDisplay = async (
    displayMediaOptions?: DisplayMediaStreamConstraints
  ) => {
    let captureStream: MediaStream | null = null;

    try {
      captureStream = await navigator.mediaDevices.getDisplayMedia(
        displayMediaOptions
      );
    } catch (err) {
      console.error("Error: " + err);
    }
    return captureStream;
  };

  const getCaptureWebcam = async (
    displayMediaOptions?: DisplayMediaStreamConstraints
  ) => {
    let captureStream: MediaStream | null = null;

    try {
      captureStream = await navigator.mediaDevices.getUserMedia(
        displayMediaOptions
      );
    } catch (err) {
      console.error("Error: " + err);
    }
    return captureStream;
  };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const speakerVideoRef = useRef<HTMLVideoElement>(null);
  const mediaStream = useRef<MediaStream>(null);
  const speakerStream = useRef<MediaStream>(null);

  const handleCaptureWebcam = async () => {
    setSpeakerVideoOn(true);
    setStreamType(streamType == "video" ? streamType : "");

    //@ts-ignore
    speakerStream.current = await getCaptureWebcam({
      video: true,
    });

    const track = speakerStream.current?.getTracks()[0];

    track?.addEventListener("ended", handleStopCaptureWebcam);

    injectSpeaker();
  };

  const handleStopCaptureWebcam = async () => {
    const video = speakerVideoRef.current;
    if (!video) return;

    const tracks = speakerStream.current?.getTracks();

    tracks?.forEach((e) => e.stop());

    video.srcObject = null;

    video.pause();
    setSpeakerVideoOn(false);
  };

  const [signal, setSignal] = useState<any>(undefined);

  const handleShareScreen = async () => {
    setStreamType("video");

    const stream = await getCaptureDisplay({
      video: {
        //@ts-ignore
        cursor: "always",
      },
      audio: {},
    });
    //@ts-ignore
    mediaStream.current = stream;

    const track = mediaStream.current?.getTracks()[0];

    track?.addEventListener("ended", handleOffScreenShare);

    const video = videoRef.current;

    if (!video) return;

    video.srcObject = mediaStream.current;

    video.play();

    setActiveScreenShare(true);

    if (speakerVideoOn) injectSpeaker();

    // socket.on("me", (id) => {
    //   setMe(id);
    // });
    if (!stream) return;
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      HandleRTC({
        variables: {
          id,
          type: "callUser",
          data: JSON.stringify(data),
        },
      });
    });
    peer.on("stream", (stream) => {
      // if (videoRef.current) videoRef.current.srcObject = stream;
    });
    channel.current?.listen("RTCNegotiation", (e: any) => {
      if (e.type == "callAccepted") peer.signal(e.data);
    });
  };

  const handleOffScreenShare = async () => {
    const video = videoRef.current;
    if (!video) return;

    const tracks = mediaStream.current?.getTracks();

    tracks?.forEach((e) => e.stop());

    setActiveScreenShare(false);

    setStreamType("");

    speakerVideoOn && handleStopCaptureWebcam();
  };

  const injectSpeaker = () => {
    const speakerRef = speakerVideoRef.current;

    if (speakerStream.current && speakerRef) {
      speakerRef.srcObject = speakerStream.current;

      try {
        speakerRef.play();
      } catch (error) {}
    }
  };

  const speakerSoundStream = useRef<MediaStream>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const pollVolumeRef = useRef<number>(null);
  const handleCaptureMic = async () => {
    const audioStream = await getCaptureWebcam({
      audio: true,
    });
    //@ts-ignore
    speakerSoundStream.current = audioStream;

    if (!audioRef.current) return;
    // no need to wire speaker voices
    // audioRef.current.srcObject = speakerSoundStream.current;
    // audioRef.current.play();

    const track = speakerStream.current?.getTracks()[0];

    track?.addEventListener("ended", handleStopCaptureMic);

    setMuted(false);
    if (!audioStream) return;
    const audioContext = new AudioContext();
    const mediaStreamAudioSourceNode =
      audioContext.createMediaStreamSource(audioStream);
    const analyserNode = audioContext.createAnalyser();
    mediaStreamAudioSourceNode.connect(analyserNode);

    const pcmData = new Float32Array(analyserNode.fftSize);
    const onFrame = () => {
      analyserNode.getFloatTimeDomainData(pcmData);
      let sumSquares = 0.0;
      for (const amplitude of pcmData) {
        sumSquares += amplitude * amplitude;
      }
      const value = Math.sqrt(sumSquares / pcmData.length);
      setSpeaking(value > 0.1);
      // @ts-ignore
      pollVolumeRef.current = window.requestAnimationFrame(onFrame);
    };
    // @ts-ignore
    pollVolumeRef.current = window.requestAnimationFrame(onFrame);
  };

  const handleStopCaptureMic = async () => {
    setMuted(true);

    const tracks = speakerSoundStream.current?.getTracks();

    tracks?.forEach((e) => e.stop());

    pollVolumeRef.current && window.cancelAnimationFrame(pollVolumeRef.current);
  };

  const [streamType, setStreamType] = useState<
    "video" | "whiteboard" | "document" | ""
  >("");

  const [activeScreenShare, setActiveScreenShare] = useState(false);
  const [speakerVideoOn, setSpeakerVideoOn] = useState(false);
  const [muted, setMuted] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  let position = { x: 0, y: 0 };
  const drawTouch = (e: React.Touch) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    ctx.beginPath(); // begin

    ctx.lineWidth = 1;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#c0392b";

    const newPos = {
      x: ((e.clientX - rect.left) / (rect.right - rect.left)) * canvas.width,
      y: ((e.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height,
    };
    ctx.moveTo(
      position.x == 0 ? newPos.x : position.x,
      position.y == 0 ? newPos.y : position.y
    ); // from

    ctx.lineTo(newPos.x, newPos.y); // to

    ctx.stroke();

    position = newPos;
  };
  const draw = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    // mouse left button must be pressed

    if (e.buttons !== 1 || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    const rect = canvas.getBoundingClientRect();

    ctx.beginPath(); // begin

    ctx.lineWidth = 1;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#c0392b";

    ctx.moveTo(position.x, position.y); // from

    const newPos = {
      x: ((e.clientX - rect.left) / (rect.right - rect.left)) * canvas.width,
      y: ((e.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height,
    };

    setMousePosition(e);

    ctx.lineTo(newPos.x, newPos.y); // to

    ctx.stroke();

    position = newPos;
  };

  const setMousePosition = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    position = {
      x: ((e.clientX - rect.left) / (rect.right - rect.left)) * canvas.width,
      y: ((e.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height,
    };
  };
  return (
    <div className="bg-dark h-screen w-screen p-6 flex flex-col gap-3">
      <audio autoPlay ref={audioRef} />
      <div style={{ height: "95%" }} className="p-2 flex gap-3">
        <div
          className={`${
            !openLeftMenu ? "w-full" : "hidden sm:flex sm:w-1/2 lg:w-2/3"
          } flex items-center justify-center relative`}
        >
          {speakerVideoOn && streamType != "" && (
            <div className="absolute bottom-0 right-0 h-56 w-56">
              <video
                autoPlay
                className="w-full h-full bruh1"
                ref={speakerVideoRef}
              />
            </div>
          )}
          {streamType == "" &&
            (speakerVideoOn ? (
              <video
                autoPlay
                className="w-full h-full bruh2"
                ref={speakerVideoRef}
              />
            ) : (
              <ImageContainer
                fallback="profile"
                className="rounded-full"
                alt="Picture of the author"
                width={50}
                height={50}
              />
            ))}
          {streamType == "whiteboard" && (
            <canvas
              className="bg-white"
              style={{
                width: 1280 / 2,
                aspectRatio: "16/9",
              }}
              ref={canvasRef}
              onMouseDown={setMousePosition}
              onMouseEnter={setMousePosition}
              onMouseMove={draw}
              onTouchMove={(e) => {
                const coords = e.touches[0];
                drawTouch(coords);
              }}
            />
          )}
          {streamType == "video" && (
            <video autoPlay className="w-full h-full bruh3" ref={videoRef} />
          )}
        </div>
        {!!openLeftMenu && (
          <div className={`w-full sm:w-1/2 lg:w-1/3 bg-white rounded`}>
            <div className="flex justify-between p-4">
              <p className="text-xl font-semibold">{openLeftMenu}</p>
              <button onClick={() => setOpenLeftMenu("")}>
                <MdClose size="1.5em" />
              </button>
            </div>
            {openLeftMenu == "Setting" && (
              <div>
                <Tabs>
                  <TabList>
                    <Tab>Video</Tab>
                    <Tab>Audio</Tab>
                    <Tab>Screen Share</Tab>
                  </TabList>
                  <TabPanel className="p-4">
                    <SimpleSelect
                      label="Camera"
                      onChange={() => {}}
                      values={[]}
                    />
                    <SimpleSelect
                      label="Resolusi"
                      onChange={() => {}}
                      values={[]}
                    />
                  </TabPanel>
                  <TabPanel className="p-4">
                    <SimpleSelect
                      label="Microphone"
                      onChange={() => {}}
                      values={[]}
                    />
                    <SimpleSelect
                      label="Speaker"
                      onChange={() => {}}
                      values={[]}
                    />
                  </TabPanel>
                  <TabPanel className="p-4"></TabPanel>
                </Tabs>
              </div>
            )}
            {openLeftMenu == "Participant" && (
              <div className="flex w-full h-full flex-col gap-2">
                <div
                  className="px-2"
                  style={{
                    height: "8%",
                  }}
                >
                  <SearchBox onChange={() => {}} />
                </div>
                <div
                  style={{
                    height: "83%",
                  }}
                  className="overflow-y-auto overflow-hidden flex flex-col gap-3"
                >
                  {[...Array(25)].map((e, i) => (
                    <div key={i} className="flex justify-between px-4">
                      <div className="flex gap-2 items-center">
                        <div>
                          <ImageContainer
                            fallback="profile"
                            className="rounded-full"
                            alt="Picture of the author"
                            width={50}
                            height={50}
                          />
                        </div>
                        <div>
                          <p className="text-xl font-semibold">Lorem, ipsum.</p>
                        </div>
                      </div>
                      <button>
                        <BsMicFill size="1.5em" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {openLeftMenu == "Chat" && (
              <div className="p-4 flex flex-col gap-3 h-full">
                <div className="h-2/6 sm:h-1/6 flex flex-col gap-2">
                  <select className="p-4 shadow rounded w-full">
                    <option value="">General</option>
                  </select>

                  <div className="flex justify-between bg-gray-100 p-2">
                    <div>Ijinkan kirim pesan</div>
                    <div className="flex gap-3">
                      <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input
                          // onChange={(e) =>
                          //   setToggleActiveBimbel(e.target.checked)
                          // }
                          type="checkbox"
                          name="toggle"
                          id="toggle"
                          className={`${
                            true ? "right-0" : ""
                          } toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer`}
                        />
                        <label
                          htmlFor="toggle"
                          className={`${
                            true ? "bg-green-300" : "bg-gray-300"
                          } toggle-label block overflow-hidden h-6 rounded-full cursor-pointer`}
                        ></label>
                      </div>
                      <div>{true ? "Aktif" : "Tidak Aktif"}</div>
                    </div>
                  </div>
                </div>
                <div className="h-3/6 sm:h-4/6 overflow-y-auto overflow-hidden mb-10">
                  {[...Array(10)].map((e, i) => (
                    <div key={i}>
                      <p>
                        <strong>You</strong> . <small>10.58</small>
                      </p>
                      <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Commodi, quod itaque ipsam illum placeat fugiat? Itaque
                        delectus a fugit provident!
                      </p>
                    </div>
                  ))}
                </div>
                <div className="h-1/6">
                  <div className="flex items-center gap-2">
                    <div className="w-5/6">
                      <input
                        className="input border border-gray-400 appearance-none rounded w-full px-3 py-3 pt-5 pb-2 focus focus:border-indigo-600 focus:outline-none active:outline-none active:border-indigo-600"
                        type="text"
                        placeholder="Kirim chat"
                      />
                    </div>
                    <button className="w-1/6 h-10  shadow rounded flex items-center justify-center hover:bg-gray-100">
                      <MdSend size="2em" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <div
        style={{
          height: "5%",
        }}
      >
        <div className="flex gap-2 items-center justify-center">
          <IconButton
            active={speaking}
            onClick={() =>
              muted ? handleCaptureMic() : handleStopCaptureMic()
            }
          >
            {muted ? (
              <BsMicFill size="1.5em" />
            ) : (
              <BsMicMute size="1.5em" color="red" />
            )}
          </IconButton>
          <IconButton
            onClick={() =>
              speakerVideoOn ? handleStopCaptureWebcam() : handleCaptureWebcam()
            }
            active={speakerVideoOn}
          >
            <BsCameraVideoFill size="1.5em" />
          </IconButton>
          <IconButton
            onClick={() =>
              activeScreenShare ? handleOffScreenShare() : handleShareScreen()
            }
            active={activeScreenShare}
          >
            <MdPresentToAll size="1.5em" />
          </IconButton>
          <IconButton onClick={() => setStreamType("whiteboard")}>
            <FaChalkboard size="1.5em" />
          </IconButton>
          <IconButton onClick={() => setOpenLeftMenu("Document")}>
            <FaUpload size="1.5em" />
          </IconButton>
          <IconButton onClick={() => setOpenLeftMenu("Setting")}>
            <AiOutlineSetting size="1.5em" />
          </IconButton>
          <IconButton onClick={() => setOpenLeftMenu("Info")}>
            <AiOutlineInfo size="1.5em" />
          </IconButton>
          <IconButton onClick={() => setOpenLeftMenu("Participant")}>
            <FaUserFriends size="1.5em" />
          </IconButton>
          <IconButton onClick={() => setOpenLeftMenu("Chat")}>
            <BiMessageAltDetail size="1.5em" />
          </IconButton>
          <IconButton>
            <AiFillCloseCircle size="1.5em" />
          </IconButton>
        </div>
      </div>
    </div>
  );
}

export default withRouter(Id);
