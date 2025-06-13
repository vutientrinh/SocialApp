package com.socialnetwork.repository;

import com.socialnetwork.model.conversation.ChatMessage;
import com.socialnetwork.model.conversation.Thread;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ThreadRepository extends JpaRepository<Thread,String>, JpaSpecificationExecutor<Thread> {
}
