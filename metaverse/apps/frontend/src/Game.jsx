import React, {useRef, useState, useEffect} from 'react';

//React functional component
const Arena = () =>
{
  const canvasRef= useRef(null);
  const wsRef =useRef(null);
  const [currentUser, setCurrentUser]=useState=({});
  const [users, setUsers]=useState=(new Map());
  const [params, setParams]=useState({token:'',spaceId:''});

  // Initialize WebSocket connection and handle URL params(useEffect responsible for Reading URL Parameter(token and spaceId), Saving them to component state using setParams)
 useEffect(() =>
{
  const urlParams= new URLSearchParams(window.location.search);
  const token= urlParams.get('token') ||'';
  const spaceId= urlParams.get('spaceId') ||'';
  setParams({token, spaceId});

  //Initialize WebsocKet
wsRef.current= new Websocket('ws://localhost:5174');
//replacing with your Ws_URL
//(.send use to sending message form websocket to server)

wsRef.current.onopen= ()=>{
  wsRef.current.send(
    JSON.stringify({
         type: 'join',
         payload:{
          spaceId,
          token,
         },
    }));
};

wsRef.current.onmessage= (event) =>{
 const message= JSON.parse(event.data);
 handleWebSocketMessage(message);
 // JSON.parse recive string is parsed from JSON into a JavaScript
};

return ()=>{
  if(wsRef.current)
  {
    wsRef.current.close();
  }
};
},[]);

//spawn : appear in the space
const handleWebSocketMessage=(message)=>{
  switch(message.type)
  {

    case 'space-joined':
      setCurrentUser({
        x: message.payload.spawn.x,
        y: message.payload.spawn.y,
        userId: message.payload.userId,
      });

      const userMap= new Map();//new Map object
      message.payload.users.ForEach((user)=>//loop iterate over user objects
      {
        userMap.set(user.userId,user);//for each user object there is an userid
      });
      setUsers(userMap);
      break;

      //if any new user joined
      case 'user-joined':
        setUsers(prev=>{
          const newUsers=new Map(prev);
          newUsers.set(message.payload.userId,{
             x: message.payload.x,
             y: message.payload.y,
             userId: message.payload.userId
          });
          return newUsers;
        });
        break;

        case 'movement':
          setUsers(prev=>{
            const newUsers=new Map(prev);
            const user=newUsers.get(message.payload.userId);
              if(user)
              {
                user.x=message.payload.x;
                user.y=message.payload.y;
                newUsers.set(message.payload.userId,user);
              }
              return newUsers;
          });
          break;


          //...prev is used to copy all axisitng properties from the prev object into a new object
          case 'movement-rejected':
            setCurrentUser(prev=>({
              ...prev,
              x: message.payload.x,
              y:message.payload.y
            }));
            break;
          
          case 'user-left':
            setUsers(prev=>{
              const newUsers = new Map(prev);
              newUsers.delete(message.payload.userId);
              return newUsers;
            });
            break;

            default:
              break;     
  }
};

//handleMove funciton is used to move message over websocket to new position(x,y)
const handleMove =(newX, newY)=>{
  if(!currentUser) return;

  wsRef.current.send(JSON.stringify({
    type: 'move',
    payload:{
      x: newX,
      y:newY,
      userId: currentUser.userId
    }
  }));
};

useEffect(()=>{
  const canvas =canvasRef.current;
  if(!canvas) return;

  const ctx=canvas.getContext('2d');
  ctx.clearRect(0,0,canvas.width,canvas.height);

  //drawing grid
  ctx.strokeStyle-'#eee';
  for(let i=0;i<canvas.width;i+=50)
  {
    ctx.beginPath();
    ctx.moveTo(i,0);//from top
    ctx.lineTo(i,canvas.height);//to bottom
    ctx.stroke();
  }

  for(let i=0;i<canvas.height;i+=50)
  {
    ctx.beginPath();
    ctx.moveTo(0,i);//from left
    ctx.lineTo(canvas.width,i);//to right
    ctx.stroke();
  }

  //Draw CurrentUser
  if(currentUser && currentUser.x !=null)
  {
    ctx.beginPath();
    ctx.fillStyle = '#FF6B6B';
    ctx.arc(currentUser.x * 50, currentUser.y*50,20,0,Math.PI*2);
    ctx.fill();
    ctx.fillStyle ='#000';
    ctx.font='14px Arial';
    ctx.textAlign='center';
    ctx.fillText('YOU',currentUser.x*50,currentUser.y*50+40);
  }

  //Draw other user
  users.forEach(user=>{
    if(user.x ==null) return;
    
    ctx.beginPath();
    ctx.fillStyle = '#4ECDC4';
    ctx.arc(user.x * 50,user.y*50,20,0,Math.PI*2);
    ctx.fill();
    ctx.fillStyle ='#000';
    ctx.font='14px Arial';
    ctx.textAlign='center';
    ctx.fillText(`User ${user.userId}`,user.x*50,user.y*50+40);
    });

  },[currentUser,users]);

  const handleKeyDown=(e)=>
  {
    if(!currentUser)return;
    const{x,y}=currentUser;
    switch(e.key)
    {
      case 'ArrowUp':
        handleMove(x,y-1);
        break;
      case 'ArrowDown':
        handleMove(x,y+1);
        break;
      case 'ArrowLeft':
        handleMove(x-1,y);
        break;
      case 'ArrowRight':
        handleMove(x+1,y);
        break;
      default:
        break;
    }
  };

   return(
    <div className="p-4" onKeyDown={handleKeyDown} tabIndex={0}>
      <h1 className="text=2xl font-blod mb-4">Arena</h1>
      <div className="mb-4">
        <p className="text-sm text-gray-600">Token: {params.token}</p>
        <p className="text-sm text-gray-600">Space ID: {params.spaceId}</p>
        <p className="text-sm text-gray-600">Connected Users: {users.size +(currentUser ? 1:0)}</p>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <canvas
         ref={canvasRef}
          width={2000}
          height={2000}
          className="bg-white"
        />
      </div>
      <p className="mt-2 text-sm text-gray-500">Use arrow Keys to move your avatar</p>
    </div>
   );
};

export default Arena;
 
