package com.example.demo.service;

import com.example.demo.entity.Person;
import java.util.List;
import java.util.Optional;

public interface PersonService {
    Person createPerson(Person person);
    
    Optional<Person> getPersonById(Long id);
    
    Optional<Person> getPersonByEmail(String email);
    
    List<Person> getAllPersons();
    
    Person updatePerson(Long id, Person personDetails);
    
    void deletePerson(Long id);
    
    List<Person> searchByLastName(String lastName);
    
    List<Person> getPersonsOlderThan(Integer age);
}
