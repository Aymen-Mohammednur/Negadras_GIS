import * as React from 'react';
import { useState, useEffect } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import { Room, Star } from '@material-ui/icons';
import { Grid } from '@material-ui/core';
import './App.css';
import axios from 'axios';
import { format } from 'timeago.js';
import Register from './components/Register';
import Login from './components/Login';

function App() {

  const BASE_URL = "http://localhost:5000/api/v1";

  const myStorage = window.localStorage;
  const [currentUser, setCurrentUser] = useState(myStorage.getItem("user"));
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [newName, setName] = useState("");
  const [newReview, setReview] = useState("");
  const [newRating, setRating] = useState(1);
  const [newCategory, setCategory] = useState("Restaurant");

  // const [type, setType] = useState("Restaurant");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(
    [
      { username: 'Aymenua', place: 'TEst', review: 'test', rating: '2', latitude: 9.00093091709374, longitude: 9.00093091709374 },
      { username: 'Aymenua', place: 'TEst', review: 'test', rating: '2', latitude: 9.00093091709374, longitude: 9.00093091709374 },
      { username: 'Aymenua', place: 'TEst', review: 'test', rating: '2', latitude: 9.00093091709374, longitude: 9.00093091709374 },
      { username: 'Aymenua', place: 'TEst', review: 'test', rating: '2', latitude: 9.00093091709374, longitude: 9.00093091709374 }
    ]
  );

  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 9.020640277083052,
    longitude: 38.80203446106989,
    zoom: 13
  });

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("/pins");
        setPins(res.data.data)
      } catch (err) {
        console.log(err)
      }
    };
    getPins()
  }, [])

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewport({ ...viewport, latitude: lat, longitude: long })
  }

  const handleDoubleClick = (e) => {
    const [long, lat] = e.lngLat;
    setNewPlace({
      latitude: lat,
      longitude: long
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      place: newName,
      review: newReview,
      rating: newRating,
      latitude: newPlace.latitude,
      longitude: newPlace.longitude,
      category: newCategory
    }
    console.log(newPin);
    try {
      console.log();
      const res = await axios.post(`${BASE_URL}/pins`, newPin);
      setPins([...pins, res.data.data])
      setNewPlace(null)
    } catch (error) {
      console.log(error)
    }
  }

  const handleLogout = () => {
    myStorage.removeItem("user");
    setCurrentUser(null);
  }

  const handleSearch = async (e) => {
    e.preventDefault();
    const res = await axios.get(`${BASE_URL}/pins/search`, { params: { query: query } })
    // console.log(res.data.data)
    setResults(res.data.data);
  }

  const handleFilter = async (e) => {
    e.preventDefault();
    console.log(e.target.value);
    const res = await axios.get(`${BASE_URL}/pins/category`, { params: { query: e.target.value } })
    setResults(res.data.data);
  }

  return (
    <div className="App">
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
        onViewportChange={nextViewport => setViewport(nextViewport)}
        mapStyle="mapbox://styles/safak/cknndpyfq268f17p53nmpwira"
        onDblClick={handleDoubleClick}
        transitionDuration="200"
      >

        {currentUser &&
          <div className='grid'>
            <div>
              <input type="text" onChange={(e) => setQuery(e.target.value)} />
              <button onClick={handleSearch}>Search</button>
            </div>

            <div>
              <label>Type</label>
              <select onChange={handleFilter}>
                <option value="Restaurant">Restaurant</option>
                <option value="Hotel">Hotel</option>
                <option value="Other">Other</option>

              </select>

            </div>

            <div>
              {results?.map((result, i) => (
                <Grid container spacing={24}>

                  <Grid key={i} item xs={4}>
                    <div className="cardResult">
                      <label>Place</label>
                      <h4 className="place">{result.place}</h4>
                      <label>Category</label>
                      <p className="desc">{result.category}</p>
                      <label>Review</label>
                      <p className="desc">{result.review}</p>
                      <label>Rating</label>
                      <div className="stars">
                        {Array(result.rating).fill(<Star className="star" />)}
                      </div>

                      <label>Information</label>
                      <span className="username">Created by <b>{result.username}</b></span>
                      <span className="date">{format(result.createdAt)}</span>

                    </div>
                  </Grid>
                </Grid>
              ))}

            </div>

            <div>
            </div>
          </div>
        }

        {pins.map(pin => (
          <>
            <Marker
              latitude={pin.latitude}
              longitude={pin.longitude}
              offsetLeft={-viewport.zoom * 1.5}
              offsetTop={-viewport.zoom * 3}>
              <Room
                style={{ fontSize: viewport.zoom * 3, color: pin.username === currentUser ? "red" : "blue", cursor: "pointer" }}
                onClick={() => handleMarkerClick(pin._id, pin.latitude, pin.longitude)}
              />
            </Marker>

            {pin._id === currentPlaceId &&
              <Popup
                latitude={pin.latitude}
                longitude={pin.longitude}
                closeButton={true}
                closeOnClick={false}
                onClose={() => setCurrentPlaceId(null)}
                anchor="left" >
                <div className="card">
                  <label>Place</label>
                  <h4 className="place">{pin.place}</h4>
                  <label>Category</label>
                  <p className="desc">{pin.category}</p>
                  <label>Review</label>
                  <p className="desc">{pin.review}</p>
                  <label>Rating</label>
                  <div className="stars">
                    {Array(pin.rating).fill(<Star className="star" />)}
                  </div>

                  <label>Information</label>
                  <span className="username">Created by <b>{pin.username}</b></span>
                  <span className="date">{format(pin.createdAt)}</span>

                </div>
              </Popup>
            }
          </>
        ))}

        {newPlace && (
          <Popup
            latitude={newPlace.latitude}
            longitude={newPlace.longitude}
            closeButton={true}
            closeOnClick={false}
            onClose={() => setNewPlace(null)}
            anchor="left" >
            <div>
              <form onSubmit={handleSubmit}>
                <label>Place Name</label>
                <input type="text" placeholder='Enter a place name' onChange={(e) => setName(e.target.value)} />
                <label>Category</label>
                <select onChange={(e) => setCategory(e.target.value)}>
                  <option value="Restaurant">Restaurant</option>
                  <option value="Hotel">Hotel</option>
                  <option value="Other">Other</option>

                </select>
                <label>Review</label>
                <input type="text" placeholder='Say something...' onChange={(e) => setReview(e.target.value)} />
                <label>Rating</label>
                <select onChange={(e) => setRating(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <button className='submitButton'>Add Place</button>
              </form>
            </div>
          </Popup>)
        }


        {currentUser ?
          (<button className="button logout" onClick={handleLogout}>Logout</button>)
          :
          (<div className="buttons">
            <button className="button login" onClick={() => setShowLogin(true)}>Login</button>
            <button className="button register" onClick={() => setShowRegister(true)}>Register</button>
          </div>)}

        {showRegister &&
          <Register setShowRegister={setShowRegister} />}
        {showLogin &&
          <Login setShowLogin={setShowLogin} myStorage={myStorage} setCurrentUser={setCurrentUser} />}

      </ReactMapGL>
    </div>
  );
}

export default App;
