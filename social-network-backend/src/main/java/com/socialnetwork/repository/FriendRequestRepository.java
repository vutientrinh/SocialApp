package com.socialnetwork.repository;

import com.socialnetwork.model.enums.RequestStatus;
import com.socialnetwork.model.relationship.FriendRequest;
import com.socialnetwork.model.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FriendRequestRepository extends JpaRepository<FriendRequest, Long> {

    @Query("SELECT f FROM FriendRequest f " +
            "WHERE f.receiver = :receiver AND f.status = :status")
    List<FriendRequest> findByReceiverAndStatus(User receiver, RequestStatus status);

    @Query("SELECT f FROM FriendRequest f " +
            "WHERE f.requester = :requester AND f.receiver = :receiver AND f.status = :status")
    FriendRequest findByRequesterAndReceiverAndStatus(User requester, User receiver, RequestStatus status);

    @Query("SELECT f FROM FriendRequest f " +
            "WHERE (f.requester = :requester AND f.receiver = :receiver AND f.status = 'PENDING')" +
            " OR (f.requester = :receiver AND f.receiver = :requester AND f.status = 'PENDING')")
    FriendRequest findByRequesterAndReceiverWithPending(User requester, User receiver);

    @Query("SELECT f FROM FriendRequest f " +
            "WHERE (f.requester = :requester AND f.receiver = :receiver AND f.status = 'ACCEPT')" +
            " OR (f.requester = :receiver AND f.receiver = :requester AND f.status = 'ACCEPT')")
    FriendRequest findByRequesterAndReceiverWithAccept(User requester, User receiver);
}
