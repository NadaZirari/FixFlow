package com.fixflow.backend.service.interfaces;

import com.fixflow.backend.entity.User;

import java.util.List;

public interface IUserService {
    List<User> findAll();
    User findById(Long id);
    User findByEmail(String email);
    User create(User user);
    User update(Long id, User userDetails);
    User toggleStatus(Long id);
    void delete(Long id);
    List<User> findByRole(String roleNom);
    boolean existsByEmail(String email);
}
