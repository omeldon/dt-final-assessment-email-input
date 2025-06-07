import React, { useRef, useEffect, useState } from "react";
import { getEmail } from "./getEmail";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EmailInput = () => {
  const [emails, setEmails] = useState([]);
  const [typed, setTyped] = useState('');
  const [suggests, setSuggests] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const refInput = useRef(null);

  const isEmailValid = (e) => {
    return emailRegex.test(e.trim());
  };

  useEffect(() => {
    if (typed.trim() === '') {
      setSuggests([]);
      setDropdownVisible(false);
      return;
    }

    getEmail(typed.trim())
      .then((result) => {
        setSuggests(result);
        setDropdownVisible(result.length > 0);
      })
      .catch(() => {
        
      });
  }, [typed]);

  const addEmail = (raw) => {
    const cleaned = raw.trim();
    if (
      !cleaned ||
      emails.some(email => email.toLowerCase() === cleaned.toLowerCase())
    ) return;

    setEmails(prev => [...prev, cleaned]);
    setTyped('');
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      addEmail(typed);
    } else if (e.key === 'Backspace' && typed === '') {
      setEmails(prev => prev.slice(0, prev.length - 1));
    }
  };

  const handleClickSuggest = (suggestion) => {
    addEmail(suggestion);
    refInput.current?.focus();
  };

  const removeEmail = (idx) => {
    const newList = [...emails];
    newList.splice(idx, 1);
    setEmails(newList);
  };

  const tagStyle = {
    padding: '2px 6px',
    borderRadius: 4,
    display: "flex",
    alignItems: "center",
    gap: 4,
    color: "black"
  };

  return (
    <div style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: "#ebebeb",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "SF Pro Text, sans-serif"
    }}>
      <div style={{
        width: 400,
        minHeight: 50,
        padding: 8,
        borderRadius: 6,
        backgroundColor: "white",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 4,
        fontSize: 16,
        position: "relative"
      }} onClick={() => refInput.current?.focus()}>
        {emails.map((mail, i) => {
          const isValid = isEmailValid(mail);
          const hovered = hoveredIdx === i;

          return (
            <div key={i} style={{
              ...tagStyle,
              backgroundColor: isValid ? (hovered ? '#ededed' : 'transparent') : '#fecaca'
            }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {mail}
              <button onClick={() => removeEmail(i)}
                style={{
                  marginLeft: 4,
                  border: 'none',
                  background: !isValid ? '#dc2626' : 'transparent',
                  color: !isValid ? 'white' : 'black',
                  borderRadius: !isValid ? '50%' : '0%',
                  width: !isValid ? 20 : 'auto',
                  height: !isValid ? 20 : 'auto',
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  cursor: "pointer",
                  visibility: isValid ? (hovered ? 'visible' : 'hidden') : 'visible',
                }}
              >
                {isValid ? '×' : (hovered ? '×' : '!')}
              </button>
            </div>
          );
        })}

        <input
          ref={refInput}
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          onKeyDown={handleKey}
          placeholder={emails.length === 0 ? 'Enter Recipients...' : ''}
          style={{
            flexGrow: 1,
            minWidth: 120,
            border: 'none',
            outline: 'none'
          }}
        />

        {dropdownVisible && suggests.length > 0 && (
          <ul
            role="listbox"
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              width: "100%",
              backgroundColor: "white",
              border: "1px solid #ccc",
              borderRadius: 4,
              marginTop: 4,
              maxHeight: 200,
              overflowY: "auto",
              zIndex: 10,
              listStyle: "none",
              padding: 0
            }}
          >
            {suggests.map((s, idx) => (
              <li
                role="option"
                key={idx}
                onClick={() => handleClickSuggest(s)}
                style={{
                  padding: "8px 12px",
                  cursor: "pointer"
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#BFDBFE"}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default EmailInput;