import { useEffect, useState } from "react";
import {
  Edit3,
  LoaderCircle,
  MessageSquareText,
  Send,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import {
  createTaskComment,
  deleteTaskComment,
  getTaskComments,
  updateTaskComment,
} from "../../services/taskComment.service";

import { useAuth } from "../../context/AuthContext";

const TaskComments = ({ taskId }) => {
  const { user } = useAuth();

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [updating, setUpdating] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  const fetchComments = async () => {
    try {
      setLoading(true);

      const response = await getTaskComments(taskId);

      const commentsData = Array.isArray(response.data.data)
        ? response.data.data
        : response.data.data?.comments || [];

      setComments(commentsData);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch comments.");

      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (taskId) {
      fetchComments();
    }
  }, [taskId]);

  const handleCreateComment = async (event) => {
    event.preventDefault();

    const message = commentText.trim();

    if (!message) {
      return;
    }

    try {
      setSubmitting(true);

      const response = await createTaskComment(taskId, {
        message,
      });

      const createdComment = response.data.data?.comment || response.data.data;

      if (createdComment?._id) {
        setComments((previousComments) => [
          ...previousComments,
          createdComment,
        ]);
      } else {
        await fetchComments();
      }

      setCommentText("");
      toast.success("Comment added successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add comment.");
    } finally {
      setSubmitting(false);
    }
  };

  const startEditing = (comment) => {
    setEditingId(comment._id);
    setEditingText(comment.message);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingText("");
  };

  const handleUpdateComment = async (commentId) => {
    const message = editingText.trim();

    if (!message) {
      toast.error("Comment cannot be empty.");
      return;
    }

    try {
      setUpdating(true);

      const response = await updateTaskComment(commentId, {
        message,
      });

      const updatedData = response.data.data?.comment || response.data.data;

      setComments((previousComments) =>
        previousComments.map((comment) =>
          comment._id === commentId
            ? {
                ...comment,
                message: updatedData?.message || message,
                updatedAt: updatedData?.updatedAt || new Date().toISOString(),
              }
            : comment,
        ),
      );

      setEditingId(null);
      setEditingText("");

      toast.success("Comment updated successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update comment.");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(commentId);

      await deleteTaskComment(commentId);

      setComments((previousComments) =>
        previousComments.filter((comment) => comment._id !== commentId),
      );

      toast.success("Comment deleted successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete comment.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
            <MessageSquareText size={19} />
          </div>

          <div>
            <h2 className="font-semibold text-gray-900">Task Discussion</h2>

            <p className="text-xs text-gray-500">
              Manager & Developer Discussions
            </p>
          </div>
        </div>

        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
          {comments.length}
        </span>
      </div>

      <div className="p-5">
        <div className="max-h-125 min-h-75 overflow-y-auto rounded-xl bg-gray-50 p-4">
          {loading ? (
            <CommentsLoading />
          ) : comments.length === 0 ? (
            <EmptyComments />
          ) : (
            <div className="space-y-5">
              {comments.map((comment) => {
                const author =
                  comment.author || comment.user || comment.createdBy;

                const currentUserId = user?._id || user?.id;

                const authorId =
                  typeof author === "object" ? author?._id : author;

                const isOwnComment = String(authorId) === String(currentUserId);

                const isEditing = editingId === comment._id;

                const isEdited =
                  comment.createdAt &&
                  comment.updatedAt &&
                  new Date(comment.updatedAt).getTime() >
                    new Date(comment.createdAt).getTime() + 1000;

                return (
                  <div
                    key={comment._id}
                    className={`flex items-end gap-2 ${
                      isOwnComment ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!isOwnComment && <UserAvatar user={author} />}

                    <div
                      className={`flex max-w-[80%] flex-col ${
                        isOwnComment ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`mb-1 flex items-center gap-2 ${
                          isOwnComment ? "flex-row-reverse" : ""
                        }`}
                      >
                        <p className="text-xs font-semibold text-gray-700">
                          {isOwnComment
                            ? "You"
                            : author?.name || "Unknown User"}
                        </p>

                        <p className="text-[11px] text-gray-400">
                          {formatDateTime(comment.createdAt)}
                          {isEdited && " • Edited"}
                        </p>
                      </div>

                      <div
                        className={`group relative rounded-2xl px-4 py-3 ${
                          isOwnComment
                            ? "rounded-br-md bg-gray-200 text-slate-700"
                            : "rounded-bl-md border border-gray-200 bg-white text-gray-700"
                        }`}
                      >
                        {isEditing ? (
                          <div className="min-w-65 sm:min-w-85">
                            <textarea
                              rows={3}
                              value={editingText}
                              onChange={(event) =>
                                setEditingText(event.target.value)
                              }
                              maxLength={1000}
                              autoFocus
                              className="w-full resize-none rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-700 outline-none focus:border-blue-500"
                            />

                            <div className="mt-2 flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={cancelEditing}
                                disabled={updating}
                                className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <X size={14} />
                                Cancel
                              </button>

                              <button
                                type="button"
                                onClick={() => handleUpdateComment(comment._id)}
                                disabled={updating || !editingText.trim()}
                                className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {updating && (
                                  <LoaderCircle
                                    size={14}
                                    className="animate-spin"
                                  />
                                )}
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="whitespace-pre-wrap wrap-break-word text-sm leading-6">
                            {comment.message}
                          </p>
                        )}

                        {isOwnComment && !isEditing && (
                          <div className="absolute -left-16 top-1/2 flex -translate-y-1/2 items-center gap-1 opacity-0 transition group-hover:opacity-100">
                            <button
                              type="button"
                              onClick={() => startEditing(comment)}
                              title="Edit comment"
                              className="cursor-pointer rounded-full bg-white p-2 text-gray-500 shadow-sm transition hover:bg-gray-100 hover:text-gray-800"
                            >
                              <Edit3 size={14} />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteComment(comment._id)}
                              disabled={deletingId === comment._id}
                              title="Delete comment"
                              className="cursor-pointer rounded-full bg-white p-2 text-gray-500 shadow-sm transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {deletingId === comment._id ? (
                                <LoaderCircle
                                  size={14}
                                  className="animate-spin"
                                />
                              ) : (
                                <Trash2 size={14} />
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {isOwnComment && <UserAvatar user={author} />}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <form
          onSubmit={handleCreateComment}
          className="mt-4 rounded-xl border border-gray-200 bg-white p-3"
        >
          <textarea
            rows={2}
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
            placeholder="Write a message..."
            maxLength={1000}
            className="w-full resize-none border-none p-1 text-sm text-gray-700 outline-none placeholder:text-gray-400"
          />

          <div className="mt-2 flex items-center justify-between border-t border-gray-100 pt-3">
            <span className="text-xs text-gray-400">
              {commentText.length}/1000
            </span>

            <button
              type="submit"
              disabled={submitting || !commentText.trim()}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? (
                <LoaderCircle size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}

              {submitting ? "Sending..." : "Send"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

const UserAvatar = ({ user }) => {
  const avatar = user?.avatar || user?.profile?.avatar;

  const firstLetter = user?.name?.charAt(0)?.toUpperCase() || "?";

  if (avatar) {
    return (
      <img
        src={avatar}
        alt={user?.name || "User"}
        className="h-10 w-10 shrink-0 rounded-full border border-gray-200 object-cover"
      />
    );
  }

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200 text-sm font-bold text-black">
      {firstLetter}
    </div>
  );
};

const CommentsLoading = () => {
  return (
    <div className="space-y-5">
      {[1, 2, 3].map((item) => (
        <div key={item} className="flex animate-pulse items-start gap-3">
          <div className="h-10 w-10 rounded-full bg-gray-200" />

          <div className="flex-1 rounded-xl bg-gray-100 p-4">
            <div className="h-4 w-32 rounded bg-gray-200" />
            <div className="mt-3 h-4 w-full rounded bg-gray-200" />
            <div className="mt-2 h-4 w-2/3 rounded bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
};

const EmptyComments = () => {
  return (
    <div className="rounded-xl border border-dashed border-gray-300 py-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500">
        <MessageSquareText size={21} />
      </div>

      <h3 className="mt-3 text-sm font-semibold text-gray-900">
        No comments yet
      </h3>

      <p className="mt-1 text-xs text-gray-500">
        Add the first comment for this task.
      </p>
    </div>
  );
};

const formatDateTime = (date) => {
  if (!date) {
    return "";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsedDate);
};

export default TaskComments;
