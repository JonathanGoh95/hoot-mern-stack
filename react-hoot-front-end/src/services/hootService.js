const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/hoots`;

const index = async () => {
  try {
    const res = await fetch(BASE_URL, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    if (!res.ok) throw new Error("Failed to retrieve Hoots");
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

const show = async (hootId) => {
  try {
    const res = await fetch(`${BASE_URL}/${hootId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    if (!res.ok) throw new Error("Failed to show Hoot");
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

const create = async (hootFormData) => {
  try {
    const res = await fetch(`${BASE_URL}/new`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(hootFormData),
    });
    if (!res.ok) throw new Error("Failed to create Hoot");
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

const createComment = async (hootId, commentFormData) => {
  try {
    const res = await fetch(`${BASE_URL}/${hootId}/comments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commentFormData),
    });
    if (!res.ok) throw new Error("Failed to create comment");
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

const deleteHoot = async (hootId) => {
  try {
    const res = await fetch(`${BASE_URL}/${hootId}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!res.ok) throw new Error("Failed to delete hoot");
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

const update = async (hootId, hootFormData) => {
  try {
    const res = await fetch(`${BASE_URL}/${hootId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(hootFormData),
    });
    if (!res.ok) throw new Error("Failed to update comment");
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

const deleteComment = async (hootId, commentId) => {
  try {
    const res = await fetch(`${BASE_URL}/${hootId}/comments/${commentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!res.ok) throw new Error("Failed to delete comment");
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

const updateComment = async (hootId, commentId, commentFormData) => {
  try {
    const res = await fetch(`${BASE_URL}/${hootId}/comments/${commentId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commentFormData),
    });
    if (!res.ok) throw new Error("Failed to delete comment");
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

export {
  index,
  show,
  create,
  createComment,
  deleteHoot,
  update,
  deleteComment,
  updateComment,
};
