# DryWall API Specification

## Global

### User session ID

Every request goes over TLS

Every request contains the user's session ID

## Endpoints

1. Set OAuth token
	Endpoint: /login/github/
	Input:
		- redirect_uri
			The location to bounce back to after GitHub issues the API a token

1. List issues by organisation and repository
	Endpoint: /stickies/
	Input:
		- github_organisation
		- github_repository
	Output:
		[{
			name: String,
			color: Hex,
			github_number: Number,
			x: Number,
			y: Number
		}]

1. List repos by organisation
	Endpoint: /repositories/
	Input:
		- github_organisation

1. List of organisations
