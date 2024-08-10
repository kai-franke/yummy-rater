import { useState } from "react";

export default function AddProduct() {
  const [providerId, setProviderId] = useState("");
  const [productData, setProductData] = useState({
    ean: "",
    name: "",
    brand: "",
    description: "",
    image: "",
    user_rating: 0,
    user_note: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProductData({
      ...productData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/user/${providerId}/add-product`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        setSuccess(true);
        setError(null);
        setProductData({
          ean: "",
          name: "",
          brand: "",
          description: "",
          image: "",
          user_rating: 0,
          user_note: "",
        });
      } else {
        const data = await response.json();
        setError(data.error || "An error occurred while adding the product.");
        setSuccess(false);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      setSuccess(false);
    }
  };

  return (
    <div>
      <h1>Add Product to User</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="providerId">Provider ID:</label>
          <input
            type="text"
            id="providerId"
            value={providerId}
            onChange={(e) => setProviderId(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="ean">EAN:</label>
          <input
            type="text"
            id="ean"
            name="ean"
            value={productData.ean}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="name">Product Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={productData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="brand">Brand:</label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={productData.brand}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={productData.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="image">Image URL:</label>
          <input
            type="text"
            id="image"
            name="image"
            value={productData.image}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="user_rating">Rating:</label>
          <input
            type="number"
            id="user_rating"
            name="user_rating"
            value={productData.user_rating}
            onChange={handleChange}
            min="0"
            max="5"
          />
        </div>
        <div>
          <label htmlFor="user_note">Note:</label>
          <textarea
            id="user_note"
            name="user_note"
            value={productData.user_note}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Add Product</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>Product added successfully!</p>}
    </div>
  );
}
