---
name: sprout
description: Watering reminders for house plants
colors:
  soil: "#2b2420"
  paper: "#f3efe6"
  leaf: "#5fae6e"
typography:
  body:
    fontFamily: "system-ui, sans-serif"
    fontSize: "16px"
    lineHeight: 1.5
components:
  plant-row-due:
    backgroundColor: "{colors.leaf}"
    textColor: "{colors.soil}"
---

# Design

## Overview

A dark, earthy list. Each plant is one row; the plant that needs water now stands out.

## Colors

- **Soil** (`#2b2420`) is the background.
- **Paper** (`#f3efe6`) is all text.
- **Leaf** (`#5fae6e`) is the accent: it marks the plant that needs water now (due or
  overdue), and the "watered" button.

## Typography

System UI at 16px for everything; plant names semibold.

## Components

- **Plant row:** name, "water in N days". A due row has a leaf background.
