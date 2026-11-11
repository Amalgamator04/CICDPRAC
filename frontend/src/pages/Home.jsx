import { useCallback, useEffect } from "react";
import { useCart } from "../context/CartContext";
import useAuth from "../hooks/useAuth";
import { useAxios } from "../hooks/useAxios";
import Reveal from "../components/Reveal";
import Hero from "./Hero";
import Products from "./Products";

export const Home = () => {
  const { dispatch } = useCart();
  const { auth } = useAuth();
  const accessToken = auth?.accessToken;
  const { api } = useAxios();

  const fetchCartData = useCallback(async () => {
    if (!accessToken) {
      dispatch({
        type: "SET_CART",
        payload: { items: [], subtotal: 0, total: 0, itemCount: 0 },
      });
      return;
    }

    dispatch({ type: "START_LOADING" });
    try {
      const response = await api.get("/cart/");
      dispatch({
        type: "SET_CART",
        payload: {
          items: response.data.items,
          subtotal: response.data.subtotal || 0,
          total: parseFloat(response.data.grand_total) || 0,
          itemCount: response.data.items?.length || 0,
        },
      });
    } catch (err) {
      console.error("Fetch error", err);
      dispatch({ type: "STOP_LOADING" });
    }
  }, [accessToken, api, dispatch]);

  useEffect(() => {
    fetchCartData();
  }, [fetchCartData]);

  return (
    <div>
      <Hero />
      <Products />
      <section id="about" className="about-section">
        <div className="section-shell about-layout">
          <Reveal className="about-copy">
            <p className="eyebrow">A note from Nocturne</p>
            <h2>For the hours<br />that belong to <em>you.</em></h2>
            <p>
              The day asks a lot of us. Nocturne is an invitation to turn the
              noise down, draw the evening close, and let a little light find
              its way in.
            </p>
            <p>
              Choose a candle for the mood you want to make: a quiet corner to
              read, a long dinner with friends, or a few unhurried minutes at
              the end of the day. Let the small things set the atmosphere.
            </p>
            <p className="about-signoff">Stay a little longer.</p>
          </Reveal>
          <Reveal className="about-image-wrap" delay={100}>
            <img
              src="https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&w=1100&q=85"
              alt="A candle glowing softly in a dark, intimate room"
              loading="lazy"
              decoding="async"
            />
            <span className="about-image-caption">A softer kind of after dark</span>
          </Reveal>
        </div>
        <div className="section-shell ritual-notes">
          <Reveal className="ritual-note">
            <span className="ritual-number">01</span>
            <h3>Choose your mood</h3>
            <p>Find a scent and a glow that feel right for the moment.</p>
          </Reveal>
          <Reveal className="ritual-note" delay={100}>
            <span className="ritual-number">02</span>
            <h3>Make a little space</h3>
            <p>Set the room, put the day aside, and settle into your evening.</p>
          </Reveal>
          <Reveal className="ritual-note" delay={200}>
            <span className="ritual-number">03</span>
            <h3>Let the night unfold</h3>
            <p>No rush. Stay with the quiet for as long as you need.</p>
          </Reveal>
        </div>
      </section>
    </div>
  );
};
