package com.example.demo.service.impl;

import com.example.demo.entity.Person;
import com.example.demo.repository.PersonRepository;
import com.example.demo.service.PersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PersonServiceImpl implements PersonService {

    private final PersonRepository personRepository;

    @Autowired
    public PersonServiceImpl(PersonRepository personRepository) {
        this.personRepository = personRepository;
    }

    @Override
    public Person createPerson(Person person) {
        if (personRepository.existsByEmail(person.getEmail())) {
            throw new IllegalArgumentException("Person with email " + person.getEmail() + " already exists");
        }
        return personRepository.save(person);
    }

    @Override
    public Optional<Person> getPersonById(Long id) {
        return personRepository.findById(id);
    }

    @Override
    public Optional<Person> getPersonByEmail(String email) {
        return personRepository.findByEmail(email);
    }

    @Override
    public List<Person> getAllPersons() {
        return personRepository.findAll();
    }

    @Override
    public Person updatePerson(Long id, Person personDetails) {
        return personRepository.findById(id).map(existingPerson -> {
            
            // Check if email is being updated and if it's unique
            if (!existingPerson.getEmail().equals(personDetails.getEmail()) && 
                personRepository.existsByEmail(personDetails.getEmail())) {
                throw new IllegalArgumentException("Email " + personDetails.getEmail() + " is already in use");
            }

            existingPerson.setFirstName(personDetails.getFirstName());
            existingPerson.setLastName(personDetails.getLastName());
            existingPerson.setEmail(personDetails.getEmail());
            existingPerson.setAge(personDetails.getAge());
            existingPerson.setPhoneNumber(personDetails.getPhoneNumber());
            
            return personRepository.save(existingPerson);
        }).orElseThrow(() -> new IllegalArgumentException("Person not found with id " + id));
    }

    @Override
    public void deletePerson(Long id) {
        if (!personRepository.existsById(id)) {
            throw new IllegalArgumentException("Person not found with id " + id);
        }
        personRepository.deleteById(id);
    }

    @Override
    public List<Person> searchByLastName(String lastName) {
        return personRepository.findByLastName(lastName);
    }

    @Override
    public List<Person> getPersonsOlderThan(Integer age) {
        return personRepository.findByAgeGreaterThan(age);
    }
}
