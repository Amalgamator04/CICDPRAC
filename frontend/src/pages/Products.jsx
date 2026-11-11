import { useEffect, useState } from "react";
import { ArrowUpRight, ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import Reveal from "../components/Reveal";
import { useCart } from "../context/CartContext";
import useAuth from "../hooks/useAuth";
import { useAxios } from "../hooks/useAxios";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartError, setCartError] = useState("");
  const [addingProduct, setAddingProduct] = useState(null);
  const navigate = useNavigate();
  const { dispatch } = useCart();
  const { auth } = useAuth();
  const { api: authenticatedApi } = useAxios();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get("/products/");
        setProducts(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = async (productId) => {
    if (!auth?.accessToken) {
      navigate("/login");
      return;
    }

    setAddingProduct(productId);
    setCartError("");
    try {
      const response = await authenticatedApi.post("/cart/add/", {
        product_id: productId,
        quantity: 1,
      });
      dispatch({
        type: "SET_CART",
        payload: {
          items: response.data.items,
          subtotal: response.data.subtotal || 0,
          total: parseFloat(response.data.grand_total) || 0,
          itemCount: response.data.items?.length || 0,
        },
      });
    } catch (requestError) {
      console.error("Failed to add product to cart:", requestError);
      setCartError(
        requestError.response?.data?.error ||
          "Couldn't add this candle right now. Please try again."
      );
    } finally {
      setAddingProduct(null);
    }
  };

  if (loading) {
    return (
      <section id="products" className="collection-section">
        <div className="section-shell collection-loading">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading collection...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="products" className="collection-section">
        <div className="section-shell collection-error">
          <p className="eyebrow">The collection</p>
          <h2>Our candles are taking a moment.</h2>
          <p>{error}</p>
          <button
            className="button button-outline"
            onClick={() => window.location.reload()}
          >
            Try again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="collection-section">
      <div className="section-shell">
        <Reveal className="section-heading">
          <p className="eyebrow">The collection</p>
          <div className="section-heading-row">
            <div>
              <h2>Made for the<br /><em>in-between.</em></h2>
              <p className="section-description">
                Small flames. Slower evenings. Find the scent that feels like
                yours.
              </p>
            </div>
            <span className="collection-count">
              {String(products.length).padStart(2, "0")} <span>pieces</span>
            </span>
          </div>
        </Reveal>

        {cartError && (
          <p className="inline-message" role="alert">{cartError}</p>
        )}

        {products.length > 0 ? (
          <div className="product-grid">
            {products.map((product, index) => (
              <Reveal
                key={product.id}
                as="article"
                className="product-card"
                delay={Math.min(index % 2, 1) * 100}
              >
                <Link
                  to={`/product/${product.id}`}
                  className="product-image-link"
                  aria-label={`View ${product.name}`}
                >
                  <div className="product-image-frame">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="product-image"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="product-image-placeholder">
                        <span>Nocturne</span>
                      </div>
                    )}
                    <span className="product-image-index">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="product-view-link">
                      Discover <ArrowUpRight size={16} />
                    </span>
                  </div>
                </Link>
                <div className="product-details">
                  <div className="product-title-row">
                    <h3 title={product.name}>{product.name}</h3>
                    <span className="product-price">
                      ${Number(product.price).toFixed(2)}
                    </span>
                  </div>
                  <p className="product-description-label">A closer look</p>
                  <p className="product-description">
                    {product.description || "A little warmth for your evening."}
                  </p>
                  <div className="product-card-bottom">
                    <span className="product-stock">
                      {product.stock > 0 ? "Available now" : "Temporarily away"}
                    </span>
                    <button
                      type="button"
                      className="button button-add"
                      onClick={() => addToCart(product.id)}
                      disabled={product.stock <= 0 || addingProduct === product.id}
                    >
                      <ShoppingBag size={15} />
                      {addingProduct === product.id ? "Adding" : "Add to cart"}
                    </button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="collection-empty">
            <p className="eyebrow">A little quiet for now</p>
            <h3>The collection is being prepared.</h3>
            <p>Check back soon for something made to glow.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Products;
