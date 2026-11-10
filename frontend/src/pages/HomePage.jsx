import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
} from "../lib/api";
import { Link } from "react-router";
import {
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MapPinIcon,
  SearchIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";

import { capitialize } from "../lib/utils";

import FriendCard, { getLanguageFlag } from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input to avoid hitting backend on every keystroke
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // reset to page 1 on new search
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
    staleTime: 60 * 1000,
  });

  const { data: usersData, isLoading: loadingUsers } = useQuery({
    queryKey: ["users", page, debouncedSearch],
    queryFn: () => getRecommendedUsers({ page, limit: 12, search: debouncedSearch }),
    staleTime: 60 * 1000,
  });

  const recommendedUsers = Array.isArray(usersData) ? usersData : usersData?.users || [];
  const pagination = usersData?.pagination;

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
    staleTime: 30 * 1000,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        if (req.recipient?._id) {
          outgoingIds.add(req.recipient._id);
        }
      });
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Friends</h2>
          <Link to="/notifications" className="btn btn-outline btn-sm">
            <UsersIcon className="mr-2 size-4" />
            Friend Requests
          </Link>
        </div>

        {loadingFriends ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}

        <section>
          <div className="mb-6 sm:mb-8 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Meet New Learners</h2>
                <p className="opacity-70">
                  Discover perfect language exchange partners based on your profile
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-72">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 opacity-50" />
                <input
                  type="text"
                  placeholder="Search by name, language, city..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input input-sm input-bordered w-full pl-9"
                />
              </div>
            </div>
          </div>

          {loadingUsers ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="card bg-base-200 p-6 text-center">
              <h3 className="font-semibold text-lg mb-2">No recommendations available</h3>
              <p className="text-base-content opacity-70">
                {debouncedSearch
                  ? "No learners match your search criteria. Try a different query!"
                  : "Check back later for new language partners!"}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedUsers.map((user) => {
                  const hasRequestBeenSent = outgoingRequestsIds.has(user._id);

                  return (
                    <div
                      key={user._id}
                      className="card bg-base-200 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="card-body p-5 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="avatar size-16 rounded-full">
                            <img
                              src={user.profilePic}
                              alt={user.fullName}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(user.email || user.fullName)}`;
                              }}
                            />
                          </div>

                          <div>
                            <h3 className="font-semibold text-lg">{user.fullName}</h3>
                            {user.location && (
                              <div className="flex items-center text-xs opacity-70 mt-1">
                                <MapPinIcon className="size-3 mr-1" />
                                {user.location}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Languages with flags */}
                        <div className="flex flex-wrap gap-1.5">
                          <span className="badge badge-secondary">
                            {getLanguageFlag(user.nativeLanguage)}
                            Native: {capitialize(user.nativeLanguage)}
                          </span>
                          <span className="badge badge-outline">
                            {getLanguageFlag(user.learningLanguage)}
                            Learning: {capitialize(user.learningLanguage)}
                          </span>
                        </div>

                        {user.bio && <p className="text-sm opacity-70 line-clamp-2">{user.bio}</p>}

                        {/* Action button */}
                        <button
                          className={`btn w-full mt-2 ${
                            hasRequestBeenSent ? "btn-disabled" : "btn-primary"
                          } `}
                          onClick={() => sendRequestMutation(user._id)}
                          disabled={hasRequestBeenSent || isPending}
                        >
                          {hasRequestBeenSent ? (
                            <>
                              <CheckCircleIcon className="size-4 mr-2" />
                              Request Sent
                            </>
                          ) : (
                            <>
                              <UserPlusIcon className="size-4 mr-2" />
                              Send Friend Request
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination Controls for scale (100k+ users) */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-4 border-t border-base-300">
                  <p className="text-sm opacity-70">
                    Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                    {pagination.total} learners
                  </p>
                  <div className="join">
                    <button
                      className="join-item btn btn-sm"
                      onClick={() => setPage((p) => Math.max(p - 1, 1))}
                      disabled={pagination.page <= 1 || loadingUsers}
                    >
                      <ChevronLeftIcon className="size-4 mr-1" />
                      Previous
                    </button>
                    <button className="join-item btn btn-sm btn-ghost pointer-events-none">
                      Page {pagination.page} of {pagination.totalPages}
                    </button>
                    <button
                      className="join-item btn btn-sm"
                      onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages))}
                      disabled={!pagination.hasMore || loadingUsers}
                    >
                      Next
                      <ChevronRightIcon className="size-4 ml-1" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
