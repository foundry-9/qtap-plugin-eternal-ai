# text-to-image API

## Request example

```bash
curl --location 'https://open.eternalai.org/creative-ai/image' \
--header 'accept: application/json' \
--header 'x-api-key: <YOUR_API_KEY>' \
--header 'Content-Type: application/json' \
--data '{
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "A beautiful young woman sits on the bed."
                }
            ]
        }
    ],
    "type": "new",
    "lora_config": {
        "Art_style_Impressionist": 1
    }
}'
```

## Pending response example

```json
{
    "request_id": "921864",
    "status": "pending",
    "result": "",
    "progress": 0
}
```

## Result retrieval example

```bash
curl --location 'https://open.eternalai.org/creative-ai/result/image?request_id=$REQUEST_ID' \
--header 'accept: application/json'
```

## Finished response example

```json
{
    "request_id": "1829499",
    "status": "success",
    "progress": 0,
    "created_at": "2026-01-14T07:43:15Z",
    "updated_at": "2026-01-14T07:44:04Z",
    "image_request_type": "generation",
    "file_name": "5bf6581e-e3c4-409d-b70a-c6cb1876ea61.png",
    "prompt": "A beautiful young woman sits on the bed.",
    "magic_prompt": "A beautiful young woman sits on the bed.",
    "model": "black-forest-labs/FLUX.1-dev",
    "result_image": "",
    "result_image_url": "https://cdn.eternalai.org/feed/2026/01/14/5bf6581e-e3c4-409d-b70a-c6cb1876ea61.png",
    "result_url": "https://cdn.eternalai.org/feed/2026/01/14/5bf6581e-e3c4-409d-b70a-c6cb1876ea61.png",
    "queue_info": {
        "queue_position": null,
        "total_queue_size": null,
        "estimated_wait_time": null
    },
    "post_feed": false,
    "log": ""
}
```

## LORA styles

### Daubrez Painterly Style

```bash
curl --location 'https://open.eternalai.org/creative-ai/image' \
--header 'accept: application/json' \
--header 'x-api-key: <YOUR_API_KEY>' \
--header 'Content-Type: application/json' \
--data '{
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "DB4RZ Daubrez style painting of abstract art masterpiece"
                }
            ]
        }
    ],
    "type": "new",
    "lora_config": {
        "FLUX-daubrez-DB4RZ": 1
    }
}'
```

### Anime Art Style

```bash
curl --location 'https://open.eternalai.org/creative-ai/image' \
--header 'accept: application/json' \
--header 'x-api-key: <YOUR_API_KEY>' \
--header 'Content-Type: application/json' \
--data '{
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Psycho_4rt anime girl with glitching abstract surreal brushstrokes"
                }
            ]
        }
    ],
    "type": "new",
    "lora_config": {
        "psycho_art": 1
    }
}'
```

### Flux.1_Mechanical Bloom · Surreal Anime-style Portrait

```bash
curl --location 'https://open.eternalai.org/creative-ai/image' \
--header 'accept: application/json' \
--header 'x-api-key: <YOUR_API_KEY>' \
--header 'Content-Type: application/json' \
--data '{
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "CynthiaPortrait: Human girl with mechanical floral implants in a decaying cyberpunk cityscape"
                }
            ]
        }
    ],
    "type": "new",
    "lora_config": {
        "Flux_1_MechanicalBloom": 1
    }
}'
```

### RandomMaxx Artistify

```bash
curl --location 'https://open.eternalai.org/creative-ai/image' \
--header 'accept: application/json' \
--header 'x-api-key: <YOUR_API_KEY>' \
--header 'Content-Type: application/json' \
--data '{
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Elegant girl flowing hair surrounded by surreal dreamlike artistic elements"
                }
            ]
        }
    ],
    "type": "new",
    "lora_config": {
        "RM_Artistify_v1_0M": 1
    }
}'
```

## Text-to-Image Prompting

### Core Prompt Structure

For best results, organize your prompts using:&#x20;

> Subject + Action + Style + Context

**Example**: "Golden retriever running along beach shore, nature photography, early morning sunlight"

* **Subject**: Primary element in your image (person, animal, object, scene)
* **Action**: Movement, pose, or activity being performed
* **Style**: Visual approach, artistic medium, or aesthetic direction
* **Context**: Environmental details, lighting conditions, time of day, atmosphere

<div data-with-frame="true"><figure><img src="https://3871126207-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FNGd2C3Tgbh0n4UhfKCoC%2Fuploads%2FE4XycoQ3LuLhinaLNIIM%2Fimage.png?alt=media&#x26;token=11d9a57a-7fdd-4248-ada2-f9dfe915115f" alt=""><figcaption></figcaption></figure></div>

### Building Effective Descriptions

Combine natural language for describing relationships with precise technical specifications for visual elements.

1. "Mechanical robot tending garden of bioluminescent plants, soft volumetric lighting, concept art aesthetic, wide-angle perspective"
2. "Mountain climber reaching summit peak, adventure photography with natural lighting, triumphant and exhilarating mood"
3. "Pixel art wizard brewing potions in tower laboratory, isometric view, vibrant color scheme with magical particle effects"

{% columns %}
{% column %}

<div data-with-frame="true"><figure><img src="https://3871126207-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FNGd2C3Tgbh0n4UhfKCoC%2Fuploads%2FAD5MRDSZ3CaGbR6xRHWj%2Fimage.png?alt=media&#x26;token=f2be6258-328d-41d3-a600-16e61f739267" alt=""><figcaption></figcaption></figure></div>

<p align="center"><sub>Mechanical robot</sub></p>
{% endcolumn %}

{% column width="33.33333333333333%" %}

<div data-with-frame="true"><figure><img src="https://3871126207-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FNGd2C3Tgbh0n4UhfKCoC%2Fuploads%2FcK4lBJzsYPipi8MJk5KT%2Fimage.png?alt=media&#x26;token=cb1df3eb-82d5-46db-ba55-56a094483e62" alt=""><figcaption></figcaption></figure></div>

<p align="center"><sub>Mountain climber</sub></p>
{% endcolumn %}

{% column width="33.33333333333333%" %}

<div data-with-frame="true"><figure><img src="https://3871126207-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FNGd2C3Tgbh0n4UhfKCoC%2Fuploads%2F7zkgDBiEeeaJnrhIr0iV%2Fimage.png?alt=media&#x26;token=dc06adb3-f4b6-4f03-83e7-4c943017cdf2" alt=""><figcaption></figcaption></figure></div>

<p align="center"><sub>Pixel art wizard</sub></p>
{% endcolumn %}
{% endcolumns %}

### Importance of Element Positioning

Place your highest-priority elements at the beginning, gives stronger weight to earlier prompt components.

**Recommended sequence**:&#x20;

> Primary subject → Main activity → Defining style → Core context → Supporting details

### Progressive Enhancement Technique

Start with the foundation and add layers of detail:

**Base Layer**:&#x20;

> Subject + Action + Style + Context

* **Visual Details**: Lighting quality, color schemes, compositional elements.
* **Technical Specs**: Camera parameters, lens characteristics, quality indicators.
* **Mood Elements**: Emotional atmosphere, narrative depth, tonal qualities.

**Progressive example**:

* **Base**: "Deep sea diver exploring coral reef, underwater photography"
* **Enhanced**: "Deep sea diver in yellow wetsuit exploring vibrant coral reef, underwater photography with rays of sunlight piercing through water, turquoise and orange color palette, wide-angle 24mm lens, serene and mysterious atmosphere"

{% columns %}
{% column %}

<div data-with-frame="true"><figure><img src="https://3871126207-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FNGd2C3Tgbh0n4UhfKCoC%2Fuploads%2FrK5tP9eR5Cu4FrIeddPN%2Fimage.png?alt=media&#x26;token=b7f1de7c-9ef7-4da7-84f4-ba981141ec98" alt=""><figcaption></figcaption></figure></div>

<p align="center"><sub>Base</sub></p>
{% endcolumn %}

{% column %}

<div data-with-frame="true"><figure><img src="https://3871126207-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FNGd2C3Tgbh0n4UhfKCoC%2Fuploads%2FL987rHhZliC2otoDI2Gq%2Fimage.png?alt=media&#x26;token=c1b872ad-f0e3-408f-a9b4-d8aa5986f3ca" alt=""><figcaption></figcaption></figure></div>

<p align="center"><sub>Enhanced</sub></p>
{% endcolumn %}
{% endcolumns %}

### Recommended Prompt Lengths

* **Brief (10-30 words)**: Fast iterations and style testing.
* **Standard (30-80 words)**: Optimal range for most creative work.
* **Detailed (80+ words)**: Intricate scenes with specific requirements.

### Reframing Negative Concepts Positively

* Replace "no rain," with "clear sunny sky".
* Replace "not smiling," with "serious expression".
* Consider: "What should be visible instead of what I'm removing?".
* Example:&#x20;

  * Bad prompt: "A portrait of a woman *not smiling.*"
  * Better prompt: "A portrait of a woman with a *calm, thoughtful expression,* eyes focused slightly off-camera."

  <div data-with-frame="true"><figure><img src="https://3871126207-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FNGd2C3Tgbh0n4UhfKCoC%2Fuploads%2Ff2zTdG4Z5pGne1GWLKwU%2Fimage.png?alt=media&#x26;token=e280f950-a525-4f5c-97ea-c070c757edcb" alt=""><figcaption></figcaption></figure></div>

### Prompt Templates by Category

* **Portrait**: `[Character details], [facial expression/posture], [artistic style], [lighting type], [background setting]`
* **Product**: `[Item specifications], [positioning], [light configuration], [aesthetic approach], [emotional tone]`
* **Landscape**: `[Geographic location], [weather/time conditions], [viewpoint angle], [visual style], [ambient feel]`
* **Architecture**: `[Structure type], [viewing angle], [illumination], [artistic treatment], [atmospheric quality]`

### Incorporating Text Elements

Generates legible text when properly described. Follow these guidelines:

* **Explicit labeling**: "The word 'CAFE' displayed in vintage neon signage on brick wall"
* **Positional details**: Describe text location relative to other image components
* **Typography description**: "handwritten script font" or "modern sans-serif lettering"
* **Example**: "A minimalist travel poster featuring the word ‘TOKYO’ in modern sans-serif letters at the bottom center, with a mountain skyline above it and a rising sun in the background."

<div data-with-frame="true"><figure><img src="https://3871126207-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FNGd2C3Tgbh0n4UhfKCoC%2Fuploads%2FvsVZjaTwqPacUy2Poj1N%2Fimage.png?alt=media&#x26;token=22480e23-c109-4cbe-8cd7-295a59b422b7" alt=""><figcaption></figcaption></figure></div>

### Prompting Strategies by Focus Type

Choose your lead element based on what matters most in your image:

{% columns %}
{% column %}

<div data-with-frame="true"><figure><img src="https://3871126207-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FNGd2C3Tgbh0n4UhfKCoC%2Fuploads%2F5g3RSaFpmnDMgQJ068TD%2Fimage.png?alt=media&#x26;token=e2610f8b-5c62-4670-9070-9c4ab2f8aa2a" alt=""><figcaption></figcaption></figure></div>

<p align="center"><sub>Character-Centric</sub></p>
{% endcolumn %}

{% column %}

<div data-with-frame="true"><figure><img src="https://3871126207-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FNGd2C3Tgbh0n4UhfKCoC%2Fuploads%2Fn6KbTlqZT3T4ZGnp9Ji7%2Fimage.png?alt=media&#x26;token=c610eb0a-b552-4928-9b73-220ca8a464f7" alt=""><figcaption></figcaption></figure></div>

<p align="center"><sub>Environment-Centric</sub></p>
{% endcolumn %}

{% column %}

<div data-with-frame="true"><figure><img src="https://3871126207-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FNGd2C3Tgbh0n4UhfKCoC%2Fuploads%2FmsOJZrrfTZzBWJwD5Q1j%2Fimage.png?alt=media&#x26;token=3cb73ad8-c961-4ed7-be28-ac75277d4b63" alt=""><figcaption></figcaption></figure></div>

<p align="center"><sub>Artistic Style-Centric</sub></p>
{% endcolumn %}

{% column %}

<div data-with-frame="true"><figure><img src="https://3871126207-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FNGd2C3Tgbh0n4UhfKCoC%2Fuploads%2Fvt4aKPpMbtsWtm6aJxPU%2Fimage.png?alt=media&#x26;token=7ba57bff-cdb9-4ab0-ab38-cee783b905f2" alt=""><figcaption></figcaption></figure></div>

<p align="center"><sub>Photography-Centric</sub></p>
{% endcolumn %}
{% endcolumns %}

#### Character-Centric Approach

For portraits and character artwork: Lead with comprehensive character details.

> Character description → Activity → Artistic style → Environmental setting

**Progressive build**:

1. **Base**: *"Young scientist with curly red hair and round spectacles"*
2. **Activity**: *"Young scientist with curly red hair and round spectacles, examining laboratory samples"*
3. **Style**: *"Young scientist with curly red hair and round spectacles, examining laboratory samples, realistic digital painting"*
4. **Setting**: *"Young scientist with curly red hair and round spectacles, examining laboratory samples, realistic digital painting, in modern research facility"*

#### Environment-Centric Approach

For landscapes and architectural imagery: Start with location and atmosphere.

> Location → Environmental conditions → Artistic treatment → Technical details

**Progressive build**:

1. **Base**: *"Japanese mountain monastery in winter"*
2. **Atmosphere**: *"Japanese mountain monastery in winter, heavy snowfall with fog"*
3. **Style**: *"Japanese mountain monastery in winter, heavy snowfall with fog, traditional ink wash painting style"*
4. **Details**: *"Japanese mountain monastery in winter, heavy snowfall with fog, traditional ink wash painting style, with stone lanterns and pine trees"*

#### Artistic Style-Centric Approach

For creative interpretations: Open with the artistic reference or style.

> Style reference → Subject matter → Contextual details → Technical execution

**Progressive build**:

1. **Base**: *"Watercolor painting technique with soft color bleeding"*
2. **Subject**: *"Watercolor painting technique with soft color bleeding, showing coastal lighthouse"*
3. **Context**: *"Watercolor painting technique with soft color bleeding, showing coastal lighthouse, pastel pinks and blues dominating"*
4. **Technical**: *"Watercolor painting technique with soft color bleeding, showing coastal lighthouse, pastel pinks and blues dominating, loose brushwork with visible paper texture"*

#### Photography-Centric Approach

For photorealistic images: Begin with subject, then build toward technical camera details.

> Subject → Setting → Lighting design → Camera specifications

**Progressive build**:

1. **Base**: *"Fashion model in evening gown"*
2. **Setting**: *"Fashion model in evening gown, minimal gray backdrop"*
3. **Lighting**: *"Fashion model in evening gown, minimal gray backdrop, soft key light with rim lighting"*
4. **Technical**: *"Fashion model in evening gown, minimal gray backdrop, soft key light with rim lighting, 50mm lens, f/2.0, creamy bokeh background"*

### Advanced Photography Parameters

**Aperture control (f-stops)**: Determines depth of field. Lower values (`f/1.8`) create blurred backgrounds; higher values (`f/11`) maintain sharpness throughout.

**Lens focal length (millimeters)**: Controls field of view and perspective. Wider lenses (`28mm`) capture expansive scenes; telephoto lenses (`100mm`) magnify distant subjects.

**Lighting techniques**: Define the illumination approach. Examples include `"butterfly lighting"` for beauty shots, `"blue hour"` for evening ambiance

**Sample**: "Portrait photograph, 100mm lens, f/1.8, butterfly lighting, elegant studio environment"

<div data-with-frame="true"><figure><img src="https://3871126207-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FNGd2C3Tgbh0n4UhfKCoC%2Fuploads%2FOAVdVUw660fVzqIuutXa%2Fimage.png?alt=media&#x26;token=e87a8c0d-a078-4f1c-9a74-038452d28ae9" alt=""><figcaption></figcaption></figure></div>

### Prompt Quality Verification

* Have you included all essential framework components?
* Do high-priority elements appear early in your prompt?
* Are vague descriptors replaced with specific terms?
* Are you specifying desired elements rather than exclusions?
* Does the complete prompt form a cohesive vision?

### Begin Your Creative Journey

Explore the comprehensive prompting documentation for advanced techniques and deeper insights.

