import { useState } from "react";
import { useRouter } from "next/router";

export default function CreateUser() {
  const [formData, setFormData] = useState({
    providerId: "",
    firstName: "",
    lastName: "",
    email: "",
    profileImage: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          provider_id: formData.providerId,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          profile_image: formData.profileImage,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setError(null);
        setFormData({
          providerId: "",
          firstName: "",
          lastName: "",
          email: "",
          profileImage: "",
        });
      } else {
        const data = await response.json();
        setError(data.error || "An error occurred while creating the user.");
        setSuccess(false);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      setSuccess(false);
    }
  };

  return (
    <div>
      <h1>Create a New User</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="providerId">Provider ID:</label>
          <input
            type="text"
            id="providerId"
            name="providerId"
            value={formData.providerId}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="profileImage">Profile Image URL:</label>
          <input
            type="text"
            id="profileImage"
            name="profileImage"
            value={formData.profileImage}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Create User</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>User created successfully!</p>}
    </div>
  );
}
