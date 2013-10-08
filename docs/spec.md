_DryWall API Specification_

* * *

# Global

## Authentication

Every request goes over TLS. Every request contains the user's session ID in either the GET query string or the HTTP request body as the parameter `session`.

The session ID is stored by the client in localStorage, not the HTTP Cookie, to minimise bandwidth requirements.

## Error Handling

Where possible use appropriate HTTP response codes.

## Versioning

Right now there is no provision for API versioning. What can go wrong...

# Documents

## Stickie

	Stickie: {
		id: String, // Global unique ID
		name: String, // Stickie text content
		color: String, // Hex value
		github_number: Number, // Unique within a repo
		milestone: String, // <GithubMilestone.id>
		label: String, // <GithubLabel.id>
		x: Number, // Horizontal coordinate
		y: Number, // Vertical coordinate
	}

## GitHub Repository

	GithubRepository: {
		id: String, // Global unique ID
		name: String, // User friendly text label
		github_url: String, // GitHub URL
		github_organization: String, // Parent ID
	}

## GitHub Organization

	GithubOrganization: {
		id: String, // Global unique ID
		name: String, // User friendly text label
		github_url: String, // GitHub URL
	}

## GitHub Label

	GithubLabel: {
		id: String, // Global unique ID
		name: String, // User friendly text label
		color: String, // Hex value
		on_wall: Boolean, // Are these shown as stickies?
	}

## GitHub Milestone

	GithubMilestone: {
		id: String, // Global unique ID
		name: String, // User friendly text label
		color: String, // Hex value
		due_date: Date, // ISO 8601
	}

# Methods

## Set OAuth token

#### Endpoint
`GET /login/github/`

#### Input
-   `redirect_uri` *String*  
	The URL to bounce back to after GitHub issues the API a token.

#### Output
Redirect to GitHub's OAuth page with our App ID.

## List issues by organisation and repository

#### Endpoint
`GET /stickies/`

#### Input
-   `github_organization`  
	*String `GithubOrganization.id`*
-   `github_repository`  
	*String `GithubRepository.id`*

#### Output
	{
		stickies: [
			Stickie*
		]
	}

## Issues by ID

#### Endpoint
`GET|POST|PUT|DELETE|PATCH /stickies/:id`

#### Input
-   `id`  
	*String `Stickie.id`*

#### Output
	{
		stickie: Stickie
	}

## List repos by organisation

#### Endpoint
`GET /repositories/`

#### Input
-   `github_organisation`  
	*String `GithubOrganization.id`*

#### Output
	{
		organizations: [
			GithubOrganization*
		],
		repositories: [
			GithubRepository*
		]
	}

## List of organisations for a user

#### Endpoint
`GET /organizations/`

#### Output
	{
		organizations: [
			GithubOrganization*
		]
	}

## List of labels for a repository

**Note:** The order of labels matters when stickies have multiple labels. The first label (=highest weight/rank) takes priority in assigning a colour to the stickie.

#### Endpoint

`GET /labels/:github_repository`

#### Input
-   `github_repository`  
	*String `GithubRepository.id`*

#### Output
	{
		labels: [
			GithubLabel*
		]
	}

## List of milestones for a repository

#### Endpoint

`GET /milestones/:github_repository`

#### Input
-   `github_repository`  
	*String `GithubRepository.id`*

#### Output
	{
		milestones: [
			GithubMilestone*
		]
	}
