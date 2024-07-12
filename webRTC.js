const startButton = document.getElementById('startCall');
const endButton = document.getElementById('endCall');
let localStream;
let peerConnection;

startButton.addEventListener('click', async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localStream = stream;
    document.getElementById('localVideo').srcObject = stream;

    const configuration = {
      iceServers: [
        { urls: 'stun:stun.stunprotocol.org' }, // Replace with your STUN server
        { urls: 'stun:stun.l.google.com:19302' }
      ]
    };

    peerConnection = new RTCPeerConnection(configuration);
    peerConnection.addEventListener('icecandidate', handleICECandidate);
    peerConnection.addEventListener('track', handleTrack);

    stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
  } catch (error) {
    console.error('Error accessing media devices:', error);
  }
});

endButton.addEventListener('click', () => {
  localStream.getTracks().forEach(track => track.stop());
  if (peerConnection) {
    peerConnection.close();
  }
});

async function handleICECandidate(event) {
  if (event.candidate) {
    try {
      // Send the candidate to the other peer via signaling server
      // Example: signalingServer.sendCandidate(event.candidate);
    } catch (error) {
      console.error('Error sending ICE candidate:', error);
    }
  }
}

function handleTrack(event) {
  document.getElementById('remoteVideo').srcObject = event.streams[0];
}
