import React, { useEffect } from "react";
import { useQuery, gql, useSubscription } from "@apollo/client";
import { auth } from "../../../firebase-service";
import Responses from "./Responses";
import CleanResponses from "./CleanResponses"; // Uncomment if you use this component

// GraphQL query to get all requests by funspot ID
const GET_ALL_REQUESTS_BY_FUNSPOT_ID = gql`
  query GetAllRequestsByFunspotId($funspotId: ID!) {
    getAllRequestsByFunspotId(funspotId: $funspotId) {
      _id
      _account_id
      _funspot_id
      text
      emotion
      createdAt
      updatedAt
    }
  }
`;

// GraphQL subscription to listen for new messages
const MESSAGE_SENT = gql`
  subscription RequestCreated {
    requestCreated {
      _id
      _account_id
      _funspot_id
      text
      emotion
      createdAt
      updatedAt
    }
  }
`;

export default function Request(propsData) {
  const funspot = propsData.propsData;
  const funspotPhoto = funspot.photo;
  const funspotId = funspot._id;

  // UseQuery with refetchOnWindowFocus: true
  const { loading, error, data, refetch } = useQuery(
    GET_ALL_REQUESTS_BY_FUNSPOT_ID,
    {
      variables: {
        funspotId: funspotId,
      },
      refetchOnWindowFocus: true, // Refetches data when the window gains focus
    }
  );

  // Subscription to listen for new messages
  const { data: requestCreatedData } = useSubscription(MESSAGE_SENT);

  // Refetch data and play sound when a new message is received
  useEffect(() => {
    if (requestCreatedData) {
      console.log("Request Created Data: ", requestCreatedData);
      refetch(); // Trigger a refetch of the query
      const audio = new Audio("/sounds/carbonate.mp3");
      audio.play();
    }
  }, [requestCreatedData, refetch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :({error.message})</p>;

  // Ensure that data and requests are defined before sorting
  const requests = data?.getAllRequestsByFunspotId
    ? [...data.getAllRequestsByFunspotId].sort(
      (a, b) => Number(a.createdAt) - Number(b.createdAt) // Sort by numeric value of createdAt
    )
    : [];

  console.log("Before Sorting: ", data?.getAllRequestsByFunspotId);
  console.log("After Sorting: ", requests);



  if (!requests.length) {
    return (
      <div className="h-full w-full">
        <div className="p-6 w-full h-full flex flex-col gap-8 justify-center items-center ">
          <div className="flex flex-row flex-wrap" >
            <img
              alt="empty state"
              src="/assets/emptystate2.png"
              className=" w-full  h-64"
            />
          </div>
          <p className="text-lg font-bold">Quite empty in here</p>

          <p className="text-xs ">Start a conversation by typing in the box below </p>

        </div>
      </div>
    );
  }



  return (
    <>
      {requests.map((request, index) => (
        <div
          key={request._id}
          className="flex flex-col gap-2 p-4 py-10 relative"
        >
          <div className="flex flex-row gap-1">
            <img
              alt="home"
              src={auth.currentUser?.photoURL}
              className="h-12 w-12 rounded-full"
            />
            <div className="bg-white border rounded-lg p-6 text-xs">
              {request.text}
            </div>
          </div>

          {/* Line connecting message to reply */}
          {/* {index < requests.length - 1 && (
            <div className="absolute left-10 top-20 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-px h-8 bg-gray-400"></div>
            </div>
          )} */}

          <div className="flex flex-col gap-6">
            {/* <Responses
              propsData={request._id}
              funspotPhoto={funspotPhoto}
              characters={funspot.characters}
            /> */}
            {/* Uncomment the following block if you want to use the CleanResponses component */}
            <CleanResponses
              propsData={request._id}
              funspotPhoto={funspotPhoto}
              characters={funspot.characters}
            />
          </div>
        </div>
      ))}
    </>
  );
}

// import Responses from "./Responses";

// import { useQuery, gql, useSubscription } from "@apollo/client";
// // get one funspot
// const GET_ALL_REQUESTS_BY_FUNSPOT_ID = gql`
//   query GetAllRequestsByFunspotId($funspotId: ID!) {
//     getAllRequestsByFunspotId(funspotId: $funspotId) {
//       _id
//       _account_id
//       _funspot_id
//       text
//       emotion
//       createdAt
//       updatedAt
//     }
//   }
// `;

// const MESSAGE_SENT = gql`
//   subscription RequestCreated {
//     requestCreated {
//       _id
//       _account_id
//       _funspot_id
//       text
//       emotion
//       createdAt
//       updatedAt
//     }
//   }
// `;

// export default function Request(propsData) {
//   const funspot = propsData.propsData;

//   const { data: requestCreatedData } = useSubscription(MESSAGE_SENT);

//   const funspotPhoto = funspot.photo;
//   const funspotId = funspot._id;
//   const { loading, error, data } = useQuery(GET_ALL_REQUESTS_BY_FUNSPOT_ID, {
//     //Intermittent polling 2s
//     // notifyOnNetworkStatusChange: true,
//     // fetchPolicy: "network-only",
//     // errorPolicy: "all",
//     // pollInterval: 2000,
//     variables: {
//       funspotId: funspotId,
//     },
//   });

//   // console the variables
//   console.log("Funspot ID: " + funspotId);

//   useEffect(() => {
//     if (requestCreatedData) {
//       console.log("Request Created Data: " + requestCreatedData);
//     }
//   }, [requestCreatedData]);

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error :(</p>;

//   const requests = data.getAllRequestsByFunspotId;
//   console.log("TEXTPAGE------=>" + requests);

//   return (
//     <>
//       {requests.map((request) => {
//         return (
//           <div key={request._id} className="flex flex-col gap-2 p-4">
//             <div className="flex flex-row gap-1">
//               <img
//                 alt="home"
//                 src="/assets/3.jpeg"
//                 className="h-10 w-10 rounded-full"
//               />
//               <div className=" bg-white rounded-lg p-4 text-sm">
//                 {request.text}
//               </div>
//             </div>

//             <div>
//               <Responses propsData={request._id} funspotPhoto={funspotPhoto} />
//             </div>
//           </div>
//         );
//       })}
//     </>
//   );
// }
